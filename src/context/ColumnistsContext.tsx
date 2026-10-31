import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchColumnists, getCachedColumnists } from '@/services/columnistsService';
import type { Columnist } from '@/types/news';

interface ColumnistsContextValue {
  columnists: Columnist[];
  loading: boolean;
  refresh: () => Promise<void>;
  getById: (id: string) => Columnist | undefined;
}

const ColumnistsContext = createContext<ColumnistsContextValue | null>(null);

export function ColumnistsProvider({ children }: { children: ReactNode }) {
  const [columnists, setColumnists] = useState<Columnist[]>(getCachedColumnists);
  const [loading, setLoading] = useState<boolean>(() => getCachedColumnists().length === 0);

  const refresh = useCallback(async () => {
    const data = await fetchColumnists();
    setColumnists(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getById = useCallback((id: string) => columnists.find((c) => c.id === id), [columnists]);

  const value = useMemo(() => ({ columnists, loading, refresh, getById }), [columnists, loading, refresh, getById]);

  return <ColumnistsContext.Provider value={value}>{children}</ColumnistsContext.Provider>;
}

export function useColumnistsContext(): ColumnistsContextValue {
  const ctx = useContext(ColumnistsContext);
  if (!ctx) throw new Error('useColumnistsContext deve ser usado dentro de ColumnistsProvider');
  return ctx;
}
