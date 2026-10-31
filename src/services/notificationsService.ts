import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

/** Exibe notificações mesmo com o app aberto. */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const BREAKING_CHANNEL_ID = 'breaking-news';

/** Payload esperado nas notificações enviadas pelo backend. */
export interface NewsNotificationData {
  slug?: string;
}

export function getSlugFromNotification(response: Notifications.NotificationResponse): string | null {
  const data = response.notification.request.content.data as NewsNotificationData | undefined;
  return typeof data?.slug === 'string' && data.slug.length > 0 ? data.slug : null;
}

/**
 * Solicita permissão, obtém o Expo Push Token e o registra no Supabase.
 * Retorna o token ou null (simulador, permissão negada ou projeto EAS ainda não configurado).
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(BREAKING_CHANNEL_ID, {
      name: 'Últimas notícias',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1E56A0',
    });
  }

  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') return null;

  const projectId: string | undefined =
    (Constants.expoConfig?.extra?.eas as { projectId?: string } | undefined)?.projectId ??
    Constants.easConfig?.projectId;

  // TODO: projectId é gerado ao rodar `eas init` (vincula o app a uma conta Expo).
  if (!projectId) {
    console.warn('Push: projectId do EAS não configurado — rode `npx eas-cli@latest init`.');
    return null;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await savePushToken(token);
    return token;
  } catch (e) {
    console.warn('Push: falha ao obter token:', e);
    return null;
  }
}

/**
 * Registra o token via RPC `register_push_token` (a tabela não é exposta ao app).
 * TODO: depende de supabase/push_tokens.sql aplicado + Edge Function send-news-push.
 * Enquanto a função não existir, a falha é apenas registrada no log.
 */
async function savePushToken(token: string): Promise<void> {
  const { error } = await supabase.rpc('register_push_token', { p_token: token, p_platform: Platform.OS });
  if (error) console.warn('Push: não foi possível salvar o token:', error.message);
}
