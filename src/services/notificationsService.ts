import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import type * as NotificationsModule from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

type Notifications = typeof NotificationsModule;

export const BREAKING_CHANNEL_ID = 'breaking-news';

/** Payload esperado nas notificações enviadas pelo backend. */
export interface NewsNotificationData {
  slug?: string;
}

/**
 * Push não existe no Expo Go (módulo nativo removido desde o SDK 53).
 * Só funciona em development build ou no app publicado.
 */
export function isPushSupported(): boolean {
  if (Constants.appOwnership === 'expo') return false;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return false;
  return true;
}

/** Carrega expo-notifications sob demanda — importar no topo quebra o app no Expo Go. */
async function loadNotifications(): Promise<Notifications | null> {
  if (!isPushSupported()) return null;
  try {
    return await import('expo-notifications');
  } catch (e) {
    console.warn('Push: módulo de notificações indisponível:', e);
    return null;
  }
}

function getSlug(response: NotificationsModule.NotificationResponse | null): string | null {
  if (!response) return null;
  const data = response.notification?.request?.content?.data as NewsNotificationData | undefined;
  return typeof data?.slug === 'string' && data.slug.length > 0 ? data.slug : null;
}

/**
 * Inicializa push: exibição em primeiro plano, registro do token e abertura da matéria ao tocar.
 * Retorna a função de limpeza dos listeners.
 */
export async function initPushNotifications(onOpenArticle: (slug: string) => void): Promise<() => void> {
  if (!isPushSupported()) return () => {};

  let Notifications: Notifications | null = null;
  try {
    Notifications = await loadNotifications();
  } catch {
    return () => {};
  }
  if (!Notifications) return () => {};

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    void registerForPushNotifications(Notifications);

    // App aberto a partir de uma notificação (aguarda o app montar a navegação)
    const initialSlug = getSlug(Notifications.getLastNotificationResponse());
    if (initialSlug) {
      setTimeout(() => onOpenArticle(initialSlug), 500);
    }

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const slug = getSlug(response);
      if (slug) onOpenArticle(slug);
    });

    return () => sub.remove();
  } catch (e) {
    console.warn('Push: erro ao inicializar listeners:', e);
    return () => {};
  }
}

/**
 * Solicita permissão, obtém o Expo Push Token e o registra no Supabase.
 * Retorna o token ou null (simulador, permissão negada ou projeto EAS ainda não configurado).
 */
async function registerForPushNotifications(Notifications: Notifications): Promise<string | null> {
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
