import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { getSlugFromNotification, registerForPushNotifications } from '@/services/notificationsService';

/**
 * Registra o dispositivo para push e abre a matéria ao tocar na notificação
 * (inclusive quando o app foi aberto a partir dela).
 */
export function usePushNotifications(): void {
  useEffect(() => {
    void registerForPushNotifications();

    const openFromResponse = (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      const slug = getSlugFromNotification(response);
      if (slug) router.push({ pathname: '/noticia/[slug]', params: { slug } });
    };

    openFromResponse(Notifications.getLastNotificationResponse());

    const sub = Notifications.addNotificationResponseReceivedListener(openFromResponse);
    return () => sub.remove();
  }, []);
}

