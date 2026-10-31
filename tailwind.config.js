const { platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Paleta idêntica ao portal web (src/index.css do projeto Vite)
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0F1A2E',
        },
        accent: {
          50: '#e6f0ff',
          100: '#bdd6ff',
          200: '#94bbff',
          300: '#6ba1ff',
          400: '#4287ff',
          500: '#1E56A0',
          600: '#1a4b8c',
          700: '#153f78',
          800: '#113364',
          900: '#0d2750',
        },
        surface: '#f8f9fa',
      },
      // Fontes do portal: Inter (texto) e Merriweather (títulos de destaque).
      // No React Native cada peso é uma família própria — use font-inter-bold em vez de font-bold.
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'inter-extrabold': ['Inter_800ExtraBold'],
        'inter-black': ['Inter_900Black'],
        serif: ['Merriweather_700Bold'],
        mono: platformSelect({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
      },
    },
  },
  plugins: [],
};
