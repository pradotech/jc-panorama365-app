/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Paleta herdada do portal web (src/index.css do projeto Vite)
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
          500: '#1E56A0',
          600: '#1a4b8c',
          700: '#153f78',
        },
        surface: '#f8f9fa',
      },
    },
  },
  plugins: [],
};

