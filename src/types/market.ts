export interface StockQuote {
  symbol: string;
  shortName: string;
  price: number;
  change: number;
  changePercent: number;
  updatedAt: string;
}

export interface DollarRate {
  pair: string;
  name: string;
  bidPrice: number;
  askPrice: number;
  high: number;
  low: number;
  variation: number;
  changePercent: number;
  updatedAt: string;
  source?: string;
}

export interface StocksResult {
  items: StockQuote[];
  lastUpdated: Date;
}

export interface DollarResult {
  rate: DollarRate;
  lastUpdated: Date;
}

