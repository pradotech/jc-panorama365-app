import { ArrowDownRight, ArrowUpRight, BarChart2, DollarSign, Minus, TrendingDown, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { CardFooter, CardHeader, CardLoading, Stat, formatDateTime } from '@/components/WeatherCard';
import { colors, gradients, shadows } from '@/constants/theme';
import type { DollarResult, StocksResult } from '@/types/market';

function formatBRL(value: number | undefined, min = 2, max = 2): string {
  if (value === undefined || Number.isNaN(value)) return 'R$ --';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: min, maximumFractionDigits: max });
}

function formatPercent(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '0,00%';
  return `${value > 0 ? '+' : ''}${value.toFixed(2).replace('.', ',')}%`;
}

function trendColors(value: number | undefined) {
  if (value !== undefined && value > 0) return { bg: 'bg-emerald-50', text: 'text-emerald-700', color: colors.emerald700, Icon: TrendingUp };
  if (value !== undefined && value < 0) return { bg: 'bg-rose-50', text: 'text-rose-700', color: colors.rose700, Icon: TrendingDown };
  return { bg: 'bg-navy-100', text: 'text-navy-600', color: colors.navy600, Icon: Minus };
}

/** Cotação do dólar — idêntico ao DollarCard do portal. */
export function DollarCard({ dollar, loading }: { dollar: DollarResult | null; loading: boolean }) {
  const rate = dollar?.rate;
  const t = trendColors(rate?.changePercent);
  const variation = rate?.variation ?? 0;

  return (
    <View className="w-full overflow-hidden rounded-2xl border border-navy-100 bg-white" style={shadows.card}>
      <CardHeader
        icon={<DollarSign size={17} color={colors.emerald300} />}
        title="Cotação Dólar"
        tag="USD / BRL"
        gradient={gradients.dollar}
      />
      <View className="p-3.5">
        {loading && !rate ? (
          <CardLoading label="Carregando cotação do dólar..." />
        ) : !rate ? (
          <CardLoading label="Cotação indisponível no momento." />
        ) : (
          <View>
            <View className="mb-2.5 flex-row flex-wrap items-end justify-between gap-1.5">
              <View>
                <Text className="mb-0.5 font-inter-semibold text-[10px] uppercase tracking-wider text-navy-400">
                  Dólar Comercial
                </Text>
                <Text className="font-mono text-xl font-black tracking-tight text-navy-950">{formatBRL(rate.bidPrice, 3, 4)}</Text>
              </View>
              <View className={`flex-row items-center gap-1 rounded-lg px-2 py-0.5 ${t.bg}`}>
                <t.Icon size={13} color={t.color} strokeWidth={2.5} />
                <Text className={`font-inter-bold text-[11px] ${t.text}`}>{formatPercent(rate.changePercent)}</Text>
              </View>
            </View>

            <View className="flex-row rounded-xl border border-navy-100 bg-navy-50 px-2 py-2">
              <Stat
                icon={<ArrowUpRight size={10} color={colors.emerald600} />}
                label="Máx."
                value={rate.high.toFixed(3).replace('.', ',')}
              />
              <Stat
                icon={<ArrowDownRight size={10} color={colors.rose600} />}
                label="Mín."
                value={rate.low.toFixed(3).replace('.', ',')}
                bordered
              />
              <Stat
                label="Oscilação"
                value={`${variation > 0 ? '+' : ''}R$ ${Math.abs(variation).toFixed(3).replace('.', ',')}`}
                valueClassName={t.text}
              />
            </View>

            <CardFooter
              left={rate.source ?? 'Banco Central / Câmbio'}
              right={`Atualizado em ${formatDateTime(rate.updatedAt || dollar?.lastUpdated)}`}
            />
          </View>
        )}
      </View>
    </View>
  );
}

/** Ações da B3 — idêntico ao StocksCard do portal. */
export function StocksCard({ stocks, loading }: { stocks: StocksResult | null; loading: boolean }) {
  const items = stocks?.items ?? [];

  return (
    <View className="w-full overflow-hidden rounded-2xl border border-navy-100 bg-white" style={shadows.card}>
      <CardHeader
        icon={<BarChart2 size={17} color={colors.accent300} />}
        title="Ações B3"
        tag="Principais"
        gradient={gradients.stocks}
      />
      <View className="p-3.5">
        {loading && items.length === 0 ? (
          <CardLoading label="Carregando cotações..." />
        ) : items.length === 0 ? (
          <CardLoading label="Cotações indisponíveis no momento." />
        ) : (
          items.map((stock, i) => {
            const t = trendColors(stock.changePercent);
            return (
              <View
                key={stock.symbol}
                className={`flex-row items-center justify-between gap-2 px-1.5 py-2 ${i > 0 ? 'border-t border-navy-50' : ''}`}
              >
                <View className="min-w-0 flex-1">
                  <Text className="font-inter-bold text-xs tracking-tight text-navy-950">{stock.symbol}</Text>
                  <Text className="font-inter text-[10px] text-navy-400" numberOfLines={1}>
                    {stock.shortName}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-mono text-xs font-bold text-navy-900">{formatBRL(stock.price)}</Text>
                  <View className={`flex-row items-center gap-0.5 rounded px-1.5 py-0.5 ${t.bg}`}>
                    <t.Icon size={10} color={t.color} strokeWidth={2.5} />
                    <Text className={`font-inter-semibold text-[10px] ${t.text}`}>{formatPercent(stock.changePercent)}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
        <CardFooter
          left="B3 • Bovespa"
          right={`Atualizado em ${formatDateTime(items[0]?.updatedAt ?? stocks?.lastUpdated)}`}
        />
      </View>
    </View>
  );
}

