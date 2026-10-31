import type { RealtimeChannel } from '@supabase/supabase-js';
import { readCache, writeCache } from '@/lib/cache';
import { getArticleImages, isColumnistArticle } from '@/lib/newsUtils';
import { supabase } from '@/lib/supabase';
import type { News, NewsRow } from '@/types/news';

const CACHE_KEY = 'jc_news_cache_v1';

function normalize(row: NewsRow): News {
  const images = getArticleImages(row);
  const base: News = { ...row, images };
  return isColumnistArticle(row) ? { ...base, category: 'colunistas' } : base;
}

/** Notícias em cache local (exibidas instantaneamente ao abrir o app / offline). */
export function getCachedNews(): News[] {
  const cached = readCache<News[]>(CACHE_KEY);
  return Array.isArray(cached) ? cached : [];
}

/**
 * Busca todas as notícias publicadas no Supabase (mesma tabela do portal).
 * Em caso de falha de rede, retorna o cache local.
 */
export async function fetchPublishedNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.warn('Falha ao buscar notícias:', error.message);
    return getCachedNews();
  }

  const normalized = (data as NewsRow[]).map(normalize);
  writeCache(CACHE_KEY, normalized);
  return normalized;
}

/** Busca uma matéria específica (usado ao abrir via push antes da lista carregar). */
export async function fetchNewsBySlug(slug: string): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) return null;
  return normalize(data as NewsRow);
}

/** Escuta alterações na tabela `news` (publicações feitas pelo admin web). */
export function subscribeToNewsChanges(onChange: () => void): () => void {
  let channel: RealtimeChannel | null = null;
  try {
    channel = supabase
      .channel('news-changes-app')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, onChange)
      .subscribe();
  } catch (e) {
    console.warn('Realtime indisponível:', e);
  }

  return () => {
    if (channel) void supabase.removeChannel(channel);
  };
}

// ---- Seletores puros (equivalentes aos do NewsContext web) ----

const byDateDesc = (a: News, b: News): number =>
  new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime();

const byHomeOrder = (a: News, b: News): number => {
  const orderA = a.home_order && Number(a.home_order) > 0 ? Number(a.home_order) : 999999;
  const orderB = b.home_order && Number(b.home_order) > 0 ? Number(b.home_order) : 999999;
  if (orderA !== orderB) return orderA - orderB;
  return byDateDesc(a, b);
};

export function selectFeatured(news: News[]): News[] {
  return news.filter((n) => n.featured && n.show_on_home !== false).sort(byHomeOrder);
}

export function selectHome(news: News[]): News[] {
  return news.filter((n) => n.show_on_home).sort(byHomeOrder);
}

export function selectByCategory(news: News[], category: string): News[] {
  return news
    .filter((n) => {
      const columnist = isColumnistArticle(n);
      if (category === 'colunistas') return columnist;
      if (category === 'variedades') return n.category === 'variedades' && !columnist;
      return n.category === category;
    })
    .sort(byDateDesc);
}

export function selectByColumnist(news: News[], columnistId: string, columnistName?: string): News[] {
  return news
    .filter(
      (n) => n.columnist_id === columnistId || (Boolean(columnistName) && n.columnist_name === columnistName)
    )
    .sort(byDateDesc);
}

export function searchNews(news: News[], query: string): News[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return news
    .filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.subtitle ?? '').toLowerCase().includes(q) ||
        (n.content ?? '').toLowerCase().includes(q) ||
        (n.author ?? '').toLowerCase().includes(q)
    )
    .sort(byDateDesc);
}

export function selectRelated(news: News[], article: News, limit = 4): News[] {
  return news.filter((n) => n.id !== article.id && n.category === article.category).sort(byDateDesc).slice(0, limit);
}
