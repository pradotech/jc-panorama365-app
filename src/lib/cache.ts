import 'expo-sqlite/localStorage/install';

/**
 * Cache local persistente (localStorage provido pelo expo-sqlite).
 * Substitui o localStorage do navegador usado no portal web.
 */
export function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Não foi possível gravar o cache "${key}":`, e);
  }
}
