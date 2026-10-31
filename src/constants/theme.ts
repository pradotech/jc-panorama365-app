/** Paleta herdada do portal web — usada onde className não se aplica (ícones, RenderHTML, navegação). */
export const colors = {
  navy950: '#0F1A2E',
  navy900: '#102a43',
  navy700: '#334e68',
  navy500: '#627d98',
  navy400: '#829ab1',
  navy300: '#9fb3c8',
  navy100: '#d9e2ec',
  navy50: '#f0f4f8',
  accent: '#1E56A0',
  accentLight: '#e6f0ff',
  breaking: '#b91c1c',
  breakingDark: '#991b1b',
  surface: '#f8f9fa',
  white: '#ffffff',
  positive: '#15803D',
  negative: '#B91C1C',
} as const;

/** URL pública do portal, usada nos links de compartilhamento. */
export const PORTAL_URL = process.env.EXPO_PUBLIC_PORTAL_URL ?? '';
