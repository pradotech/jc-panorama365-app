import type { ViewStyle } from 'react-native';

/** Paleta herdada do portal web — usada onde className não se aplica (ícones, RenderHTML, navegação). */
export const colors = {
  navy950: '#0F1A2E',
  navy900: '#102a43',
  navy800: '#243b53',
  navy700: '#334e68',
  navy600: '#486581',
  navy500: '#627d98',
  navy400: '#829ab1',
  navy300: '#9fb3c8',
  navy200: '#bcccdc',
  navy100: '#d9e2ec',
  navy50: '#f0f4f8',
  accent: '#1E56A0',
  accent600: '#1a4b8c',
  accent400: '#4287ff',
  accent300: '#6ba1ff',
  accentLight: '#e6f0ff',
  breaking: '#b91c1c',
  breakingDark: '#991b1b',
  red600: '#dc2626',
  surface: '#f8f9fa',
  white: '#ffffff',
  emerald600: '#059669',
  emerald700: '#047857',
  rose600: '#e11d48',
  rose700: '#be123c',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  amber600: '#d97706',
  cyan300: '#67e8f9',
  cyan500: '#06b6d4',
  cyan600: '#0891b2',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  indigo300: '#a5b4fc',
  slate400: '#94a3b8',
  emerald300: '#6ee7b7',
} as const;

/** Sombras do portal (index.css → --shadow-card / --shadow-header). */
export const shadows = {
  card: { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)' } satisfies ViewStyle,
  header: { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)' } satisfies ViewStyle,
  xl: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' } satisfies ViewStyle,
};

/** Degradês usados no portal (CSS linear-gradient, suportado nativamente no RN 0.86). */
export const gradients = {
  weather: { experimental_backgroundImage: 'linear-gradient(to right, #0F1A2E, #2563EB)' } satisfies ViewStyle,
  dollar: { experimental_backgroundImage: 'linear-gradient(to right, #1E56A0, #0F2D59)' } satisfies ViewStyle,
  stocks: { experimental_backgroundImage: 'linear-gradient(to right, #0F1A2E, #1E3A8A)' } satisfies ViewStyle,
  mostRead: { experimental_backgroundImage: 'linear-gradient(to right, #0F1A2E, #243b53)' } satisfies ViewStyle,
  latest: { experimental_backgroundImage: 'linear-gradient(to right, #1E56A0, #1a4b8c)' } satisfies ViewStyle,
  columnists: {
    experimental_backgroundImage: 'linear-gradient(135deg, #0F1A2E 0%, #102a43 60%, #1a365d 100%)',
  } satisfies ViewStyle,
  heroOverlay: {
    experimental_backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)',
  } satisfies ViewStyle,
};

/** URL pública do portal, usada nos links de compartilhamento. */
export const PORTAL_URL = process.env.EXPO_PUBLIC_PORTAL_URL ?? '';
