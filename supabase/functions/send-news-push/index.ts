// Edge Function: send-news-push
// STATUS: NÃO IMPLANTADA — rascunho para revisão.
//
// Envia uma notificação push para todos os dispositivos registrados em `push_tokens`,
// abrindo a matéria correspondente no app (data.slug).
//
// TODO: definir o gatilho de envio (decisão editorial):
//   a) botão "Enviar push" no painel admin web chamando esta função; ou
//   b) Database Webhook quando uma notícia for publicada com uma flag específica.
//
// Deploy: supabase functions deploy send-news-push
// Requer as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (já disponíveis em Edge Functions).

import { createClient } from 'npm:@supabase/supabase-js@2';

interface Payload {
  news_id: string;
}

interface PushMessage {
  to: string;
  title: string;
  body: string;
  sound: 'default';
  channelId: string;
  data: { slug: string };
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const BATCH_SIZE = 100; // limite da Expo Push API por requisição

Deno.serve(async (req: Request) => {
  // TODO: restringir a chamadas autenticadas do painel admin (verificar JWT do usuário).
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { news_id } = (await req.json()) as Payload;

  const { data: article, error: newsError } = await supabase
    .from('news')
    .select('title, subtitle, slug, status')
    .eq('id', news_id)
    .single();

  if (newsError || !article || article.status !== 'published') {
    return new Response(JSON.stringify({ error: 'Notícia não encontrada ou não publicada' }), { status: 400 });
  }

  const { data: tokens, error: tokensError } = await supabase.from('push_tokens').select('token');
  if (tokensError) {
    return new Response(JSON.stringify({ error: tokensError.message }), { status: 500 });
  }

  const messages: PushMessage[] = (tokens ?? []).map(({ token }: { token: string }) => ({
    to: token,
    title: article.title,
    body: article.subtitle ?? '',
    sound: 'default',
    channelId: 'breaking-news',
    data: { slug: article.slug },
  }));

  let sent = 0;
  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, i + BATCH_SIZE);
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    if (res.ok) sent += batch.length;
    // TODO: tratar tickets "DeviceNotRegistered" removendo tokens inválidos da tabela.
  }

  return new Response(JSON.stringify({ sent, total: messages.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

