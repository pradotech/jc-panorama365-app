import { getLocalDateString } from '@/lib/dateUtils';
import { supabase } from '@/lib/supabase';

// Trava em memória: contabiliza no máximo 1 visualização por notícia por sessão do app.
const viewedThisSession = new Set<string>();

/**
 * Registra a visualização de uma notícia na mesma tabela/RPC usada pelo portal,
 * para que o painel admin contabilize também os acessos vindos do app.
 */
export async function recordNewsView(newsId: string): Promise<void> {
  if (!newsId || viewedThisSession.has(newsId)) return;
  viewedThisSession.add(newsId);

  try {
    const { error: rpcError } = await supabase.rpc('record_news_view', { p_news_id: newsId });
    if (rpcError) {
      const { error: insertError } = await supabase
        .from('news_views')
        .insert([{ news_id: newsId, date_key: getLocalDateString() }]);
      if (insertError) console.warn('Não foi possível registrar a visualização:', insertError.message);
    }
  } catch (err) {
    console.warn('Erro ao registrar visualização:', err);
  }
}

