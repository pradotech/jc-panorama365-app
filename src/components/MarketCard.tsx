import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useMarketData } from '@/hooks/useMarketData';

const brl = (v: number, digits = 2) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });

function Change({ value }: { value: number }) {
  const up = value >= 0;
  const color = up ? colors.positive : colors.negative;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <View className="flex-row items-center">
      <Icon size={14} color={color} />
      <Text className="text-xs font-semibold" style={{ color }}>
        {up ? '+' : ''}
        {brl(value)}%
      </Text>
    </View>
  );
}

export function MarketCard() {
  const { stocks, dollar } = useMarketData();
  if (!stocks && !dollar) return null;

  const updated = stocks?.lastUpdated ?? dollar?.lastUpdated;

  return (
    <View className="rounded-xl border border-navy-100 bg-white p-4">
      <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-400">Mercado</Text>

      {dollar ? (
        <View className="mb-3 flex-row items-center justify-between rounded-lg bg-navy-50 p-3">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <DollarSign size={16} color={colors.accent} />
            </View>
            <View>
              <Text className="text-sm font-semibold text-navy-950">Dólar comercial</Text>
              <Text className="text-[11px] text-navy-400">USD/BRL</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-base font-bold text-navy-950">R$ {brl(dollar.rate.bidPrice, 3)}</Text>
            <Change value={dollar.rate.changePercent} />
          </View>
        </View>
      ) : null}

      {stocks?.items.map((s) => (
        <View key={s.symbol} className="flex-row items-center justify-between border-b border-navy-50 py-2">
          <View>
            <Text className="text-sm font-bold text-navy-950">{s.symbol}</Text>
            <Text className="text-[11px] text-navy-400">{s.shortName}</Text>
          </View>
          <View className="items-end">
            <Text className="text-sm font-semibold text-navy-950">R$ {brl(s.price)}</Text>
            <Change value={s.changePercent} />
          </View>
        </View>
      ))}

      {updated ? (
        <Text className="mt-2 text-[11px] text-navy-400">
          Atualizado em{' '}
          {updated.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </Text>
      ) : null}
    </View>
  );
}
