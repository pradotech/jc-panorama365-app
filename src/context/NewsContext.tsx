import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { fetchPublishedNews, getCachedNews, subscribeToNewsChanges } from '@/services/newsService';
import type { News } from '@/types/news';

interface NewsContextValue {
  news: News[];
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
  getBySlug: (slug: string) => News | undefined;
}

const NewsContext = createContext<NewsContextValue | null>(null);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<News[]>(getCachedNews);
  const [loading, setLoading] = useState<boolean>(() => getCachedNews().length === 0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchPublishedNews();
    setNews(data);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    void load();
    const unsubscribe = subscribeToNewsChanges(() => void load());

    // Recarrega ao voltar para o app (Realtime pode cair em segundo plano)
    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void load();
    });

    return () => {
      unsubscribe();
      appStateSub.remove();
    };
  }, [load]);

  const getBySlug = useCallback((slug: string) => news.find((n) => n.slug === slug), [news]);

  const value = useMemo(
    () => ({ news, loading, refreshing, refresh, getBySlug }),
    [news, loading, refreshing, refresh, getBySlug]
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNewsContext(): NewsContextValue {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error('useNewsContext deve ser usado dentro de NewsProvider');
  return ctx;
}
