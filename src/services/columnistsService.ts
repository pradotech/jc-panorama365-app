import { readCache, writeCache } from '@/lib/cache';
import { supabase } from '@/lib/supabase';
import type { Columnist } from '@/types/news';

const CACHE_KEY = 'jc_columnists_cache_v1';

export function getCachedColumnists(): Columnist[] {
  const cached = readCache<Columnist[]>(CACHE_KEY);
  return Array.isArray(cached) ? cached : [];
}

/** Lista de colunistas (tabela `columnists`, leitura pública). */
export async function fetchColumnists(): Promise<Columnist[]> {
  const { data, error } = await supabase.from('columnists').select('*').order('name');

  if (error) {
    console.warn('Falha ao buscar colunistas:', error.message);
    return getCachedColumnists();
  }

  const list = data as Columnist[];
  writeCache(CACHE_KEY, list);
  return list;
}

