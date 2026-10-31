import { router } from 'expo-router';
import { useEffect } from 'react';
import { initPushNotifications } from '@/services/notificationsService';

/**
 * Registra o dispositivo para push e abre a matéria ao tocar na notificação
 * (inclusive quando o app foi aberto a partir dela). No Expo Go não faz nada.
 */
export function usePushNotifications(): void {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void initPushNotifications((slug) => {
      router.push({ pathname: '/noticia/[slug]', params: { slug } });
    }).then((fn) => {
      if (cancelled) fn();
      else cleanup = fn;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
}
