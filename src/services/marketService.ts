import { readCache, writeCache } from '@/lib/cache';
import type { DollarRate, DollarResult, StockQuote, StocksResult } from '@/types/market';

/**
 * Cotações (Ações B3 e Dólar Comercial).
 * Atualiza por "janelas" do dia: 10h15, 12h20, 15h20 e 18h00 (horário de Brasília).
 *
 * Fontes, em ordem:
 * 1) Proxy do portal (market.php) — opcional, via EXPO_PUBLIC_MARKET_PROXY_URL
 * 2) APIs públicas sem token (Yahoo Finance / AwesomeAPI / DolarApi)
 *
 * O token da brapi NÃO é embutido no app (seria exposto no binário publicado nas lojas).
 */

const CACHE_PREFIX = 'jc_market_v1_';
const PROXY_URL = process.env.EXPO_PUBLIC_MARKET_PROXY_URL ?? '';
const DEFAULT_SYMBOLS = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4'];

const FRIENDLY_NAMES: Record<string, string> = {
  PETR4: 'Petrobras PN',
  VALE3: 'Vale ON',
  ITUB4: 'Itaú Unibanco',
  BBDC4: 'Bradesco PN',
};

interface CachedSlot<T> {
  slotId: string;
  data: T;
  timestamp: number;
}

export function getCurrentSlotId(date: Date = new Date()): string {
  let hour = date.getHours();
  let minute = date.getMinutes();
  try {
    const parts = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(date);
    for (const part of parts) {
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
    }
  } catch {
    // usa hora local
  }

  const m = hour * 60 + minute;
  let slot = 'antes_10h15';
  if (m >= 1080) slot = '18h00';
  else if (m >= 920) slot = '15h20';
  else if (m >= 740) slot = '12h20';
  else if (m >= 615) slot = '10h15';

  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}_slot_${slot}`;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ---------------- Ações ----------------

interface YahooChart {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        previousClose?: number;
        regularMarketTime?: number;
      };
    }>;
  };
}

async function fetchYahooStock(ticker: string): Promise<StockQuote | null> {
  const json = await fetchJson<YahooChart>(
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA?interval=1d&range=1d`
  );
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) return null;

  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = Number((price - prevClose).toFixed(2));
  const changePercent = prevClose > 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

  return {
    symbol: ticker,
    shortName: FRIENDLY_NAMES[ticker] ?? ticker,
    price,
    change,
    changePercent,
    updatedAt: meta.regularMarketTime
      ? new Date(meta.regularMarketTime * 1000).toISOString()
      : new Date().toISOString(),
  };
}

export async function fetchTopStocks(symbols: string[] = DEFAULT_SYMBOLS): Promise<StocksResult | null> {
  const slotId = getCurrentSlotId();
  const key = `${CACHE_PREFIX}stocks`;
  const cached = readCache<CachedSlot<StockQuote[]>>(key);
  if (cached && cached.slotId === slotId) {
    return { items: cached.data, lastUpdated: new Date(cached.timestamp) };
  }

  let items: StockQuote[] | null = null;

  if (PROXY_URL) {
    const json = await fetchJson<{ stocks?: StockQuote[] }>(`${PROXY_URL}?type=stocks`);
    if (json?.stocks && json.stocks.length > 0) items = json.stocks;
  }

  if (!items) {
    const results = await Promise.all(symbols.map(fetchYahooStock));
    const valid = results.filter((r): r is StockQuote => r !== null);
    if (valid.length > 0) items = valid;
  }

  if (!items) {
    return cached ? { items: cached.data, lastUpdated: new Date(cached.timestamp) } : null;
  }

  const now = Date.now();
  writeCache<CachedSlot<StockQuote[]>>(key, { slotId, data: items, timestamp: now });
  return { items, lastUpdated: new Date(items[0]?.updatedAt ?? now) };
}

// ---------------- Dólar ----------------

interface AwesomeApiResponse {
  USDBRL?: { bid?: string; ask?: string; high?: string; low?: string; varBid?: string; pctChange?: string; create_date?: string };
}

interface DolarApiItem {
  compra?: number;
  venda?: number;
  fechoAnterior?: number;
}

async function fetchFromAwesomeApi(): Promise<DollarRate | null> {
  const json = await fetchJson<AwesomeApiResponse>('https://economia.awesomeapi.com.br/json/last/USD-BRL');
  const item = json?.USDBRL;
  if (!item?.bid) return null;
  const bidPrice = parseFloat(item.bid);
  return {
    pair: 'USD-BRL',
    name: 'Dólar Comercial',
    bidPrice,
    askPrice: parseFloat(item.ask ?? item.bid),
    high: parseFloat(item.high ?? item.bid),
    low: parseFloat(item.low ?? item.bid),
    variation: parseFloat(item.varBid ?? '0'),
    changePercent: parseFloat(item.pctChange ?? '0'),
    updatedAt: item.create_date ? new Date(item.create_date.replace(' ', 'T')).toISOString() : new Date().toISOString(),
    source: 'AwesomeAPI',
  };
}

async function fetchFromDolarApi(): Promise<DollarRate | null> {
  const raw = await fetchJson<DolarApiItem | DolarApiItem[]>('https://br.dolarapi.com/v1/cotacoes/usd');
  const item = Array.isArray(raw) ? raw[0] : raw;
  if (!item || !(item.compra || item.venda)) return null;

  const bidPrice = item.compra ?? item.venda ?? 0;
  const askPrice = item.venda ?? bidPrice;
  const prev = item.fechoAnterior ?? 0;
  const variation = prev > 0 ? Number((bidPrice - prev).toFixed(4)) : 0;
  return {
    pair: 'USD-BRL',
    name: 'Dólar Comercial',
    bidPrice,
    askPrice,
    high: prev > 0 ? Math.max(bidPrice, prev) : bidPrice,
    low: prev > 0 ? Math.min(bidPrice, prev) : bidPrice,
    variation,
    changePercent: prev > 0 ? Number(((variation / prev) * 100).toFixed(2)) : 0,
    updatedAt: new Date().toISOString(),
    source: 'DolarApi',
  };
}

export async function fetchDollarRate(): Promise<DollarResult | null> {
  const slotId = getCurrentSlotId();
  const key = `${CACHE_PREFIX}dollar`;
  const cached = readCache<CachedSlot<DollarRate>>(key);
  if (cached && cached.slotId === slotId) {
    return { rate: cached.data, lastUpdated: new Date(cached.timestamp) };
  }

  let rate: DollarRate | null = null;

  if (PROXY_URL) {
    const json = await fetchJson<{ dollar?: DollarRate }>(`${PROXY_URL}?type=dollar`);
    if (json?.dollar?.bidPrice) rate = json.dollar;
  }
  if (!rate) rate = await fetchFromAwesomeApi();
  if (!rate) rate = await fetchFromDolarApi();

  if (!rate) {
    return cached ? { rate: cached.data, lastUpdated: new Date(cached.timestamp) } : null;
  }

  const now = Date.now();
  writeCache<CachedSlot<DollarRate>>(key, { slotId, data: rate, timestamp: now });
  return { rate, lastUpdated: new Date(rate.updatedAt || now) };
}
