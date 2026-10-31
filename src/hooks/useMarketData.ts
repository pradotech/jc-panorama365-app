import { useEffect, useState } from 'react';
import { fetchDollarRate, fetchTopStocks } from '@/services/marketService';
import type { DollarResult, StocksResult } from '@/types/market';

export function useMarketData() {
  const [stocks, setStocks] = useState<StocksResult | null>(null);
  const [dollar, setDollar] = useState<DollarResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchTopStocks(), fetchDollarRate()])
      .then(([s, d]) => {
        if (!mounted) return;
        setStocks(s);
        setDollar(d);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { stocks, dollar, loading };
}
