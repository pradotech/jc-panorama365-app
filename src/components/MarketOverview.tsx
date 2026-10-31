import { BarChart2, CloudSun, DollarSign } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { DollarCard, StocksCard } from '@/components/MarketCards';
import { WeatherCard } from '@/components/WeatherCard';
import { colors } from '@/constants/theme';
import { useMarketData } from '@/hooks/useMarketData';
import { useWeather } from '@/hooks/useWeather';

type Tab = 'weather' | 'dollar' | 'stocks';

/** Indicadores do dia com 3 abas (Clima / Dólar / Ações B3) — versão celular do MarketOverview do portal. */
export function MarketOverview() {
  const { stocks, dollar, loading: loadingMarket } = useMarketData();
  const { weather, loading: loadingWeather } = useWeather();
  const [tab, setTab] = useState<Tab>('weather');

  const pct = dollar?.rate.changePercent ?? 0;
  const dollarColor = pct > 0 ? 'text-emerald-600' : pct < 0 ? 'text-rose-600' : 'text-navy-500';

  return (
    <View className="gap-2.5">
      <View className="flex-row rounded-xl border border-navy-200 bg-navy-100/70 p-1">
        <TabButton
          active={tab === 'weather'}
          onPress={() => setTab('weather')}
          icon={<CloudSun size={14} color={tab === 'weather' ? colors.amber500 : colors.navy400} />}
          label="Clima"
          extra={
            weather ? <Text className="ml-0.5 font-mono text-[10px] text-navy-600">{weather.temperature}°C</Text> : null
          }
        />
        <TabButton
          active={tab === 'dollar'}
          onPress={() => setTab('dollar')}
          icon={<DollarSign size={14} color={tab === 'dollar' ? colors.accent600 : colors.navy400} />}
          label="Dólar"
          extra={
            dollar ? (
              <Text className={`ml-0.5 font-mono text-[10px] ${dollarColor}`}>
                {dollar.rate.bidPrice.toFixed(2).replace('.', ',')}
              </Text>
            ) : null
          }
        />
        <TabButton
          active={tab === 'stocks'}
          onPress={() => setTab('stocks')}
          icon={<BarChart2 size={14} color={tab === 'stocks' ? colors.accent600 : colors.navy400} />}
          label="Ações B3"
        />
      </View>

      {tab === 'weather' ? <WeatherCard weather={weather} loading={loadingWeather} /> : null}
      {tab === 'dollar' ? <DollarCard dollar={dollar} loading={loadingMarket} /> : null}
      {tab === 'stocks' ? <StocksCard stocks={stocks} loading={loadingMarket} /> : null}
    </View>
  );
}

function TabButton({
  active,
  onPress,
  icon,
  label,
  extra,
}: {
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  extra?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center gap-1 rounded-lg px-2 py-1.5 ${active ? 'bg-white' : ''}`}
      style={active ? { boxShadow: '0 1px 2px rgba(0,0,0,0.05)' } : undefined}
    >
      {icon}
      <Text className={`font-inter-bold text-xs ${active ? 'text-navy-950' : 'text-navy-600'}`} numberOfLines={1}>
        {label}
      </Text>
      {extra}
    </Pressable>
  );
}

