# JC Panorama 365 — App (iOS / Android)

App leitor do portal JC Panorama 365, em **Expo SDK 57 + React Native + TypeScript**.
Lê o mesmo banco Supabase do portal web (o painel admin continua no portal).

## Stack
- Expo Router (rotas em `src/app`)
- NativeWind 4 (Tailwind CSS 3)
- Supabase (`@supabase/supabase-js`, sessão/cache via `expo-sqlite/localStorage`)
- `@native-html/render` para o corpo das matérias (HTML do editor do admin)
- `expo-notifications` (push) e `Share` nativo (compartilhamento)

## Estrutura
```
src/
  app/          rotas: (tabs)/index, secoes, busca, colunistas · noticia/[slug] · categoria/[slug] · colunista/[id]
  components/   NewsCard, ArticleContent, ImageCarousel, WeatherCard, MarketCard...
  context/      NewsContext, ColumnistsContext
  hooks/        useWeather, useMarketData, usePushNotifications
  services/     news, columnists, analytics, weather, market, notifications, share
  lib/          supabase, cache, dateUtils, newsUtils
  constants/    categories, theme
  types/
supabase/       SQL e Edge Function de push (NÃO aplicados ainda)
```

## Configuração
```bash
cp .env.example .env   # preencher as variáveis
npm install
npx expo start
```

| Variável | Obrigatória | Uso |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | sim | Projeto Supabase do portal |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | sim | Chave anon (pública; RLS protege os dados) |
| `EXPO_PUBLIC_PORTAL_URL` | não | Domínio do portal — links de compartilhamento |
| `EXPO_PUBLIC_MARKET_PROXY_URL` | não | `market.php` do portal para cotações |

> Push notifications não funcionam no Expo Go — use um development build (`eas build --profile development`).

## Verificação
```bash
npm run typecheck
npm run doctor
```

## Publicação (EAS)
```bash
npx eas-cli@latest login
npx eas-cli@latest init                     # gera o projectId (necessário para push)
npx eas-cli@latest build --platform all --profile production
npx eas-cli@latest submit --platform all
```
Requisitos: conta Apple Developer (iOS), conta Google Play Console e projeto Firebase/FCM (push no Android),
política de privacidade publicada e ícone 1024×1024 (`assets/icon.png`).

