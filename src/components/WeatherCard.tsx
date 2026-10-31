import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Moon,
  Sun,
} from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors, gradients, shadows } from '@/constants/theme';
import type { WeatherData, WeatherIconType } from '@/types/weather';

function WeatherIcon({ type, isDay = true, size }: { type: WeatherIconType | undefined; isDay?: boolean; size: number }) {
  switch (type) {
    case 'sun':
      return isDay ? <Sun size={size} color={colors.amber500} /> : <Moon size={size} color={colors.indigo300} />;
    case 'sun-cloud':
    case 'cloud-sun':
      return isDay ? <CloudSun size={size} color={colors.amber500} /> : <CloudMoon size={size} color={colors.indigo300} />;
    case 'cloud':
      return <Cloud size={size} color={colors.slate400} />;
    case 'drizzle':
      return <CloudDrizzle size={size} color={colors.cyan500} />;
    case 'rain':
    case 'rain-heavy':
      return <CloudRain size={size} color={colors.blue500} />;
    case 'thunder':
      return <CloudLightning size={size} color={colors.amber400} />;
    case 'fog':
      return <CloudFog size={size} color={colors.slate400} />;
    default:
      return <Sun size={size} color={colors.amber500} />;
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} às ${timeStr}`;
}

/** Cabeçalho em degradê comum aos cards de clima, dólar e ações. */
export function CardHeader({
  icon,
  title,
  tag,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  tag: string;
  gradient: object;
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3" style={gradient}>
      <View className="min-w-0 flex-row items-center gap-1.5">
        {icon}
        <Text className="font-inter-bold text-xs tracking-wide text-white" numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View className="rounded bg-white/15 px-1.5 py-0.5">
        <Text className="font-inter-semibold text-[9px] uppercase text-white/90">{tag}</Text>
      </View>
    </View>
  );
}

export function CardFooter({ left, right }: { left: string; right: string }) {
  return (
    <View className="mt-2.5 flex-row items-center justify-between gap-1 border-t border-navy-100 pt-2">
      <Text className="font-inter text-[9px] text-navy-400" numberOfLines={1}>
        {left}
      </Text>
      <View className="flex-row items-center gap-1.5">
        <View className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <Text className="font-inter text-[9px] text-navy-400" numberOfLines={1}>
          {right}
        </Text>
      </View>
    </View>
  );
}

export function CardLoading({ label }: { label: string }) {
  return (
    <View className="items-center justify-center gap-2 py-6">
      <ActivityIndicator color={colors.accent} />
      <Text className="font-inter text-xs text-navy-400">{label}</Text>
    </View>
  );
}

/** Previsão do tempo — idêntico ao WeatherCard do portal. */
export function WeatherCard({ weather, loading }: { weather: WeatherData | null; loading: boolean }) {
  const isDay = weather?.isDay ?? true;
  const upcoming = (weather?.forecast ?? []).filter((d) => !d.isToday).slice(0, 5);

  return (
    <View className="w-full overflow-hidden rounded-2xl border border-navy-100 bg-white" style={shadows.card}>
      <CardHeader
        icon={<MapPin size={17} color={colors.cyan300} />}
        title={weather?.city ?? 'Jundiaí, SP'}
        tag="Tempo & Semana"
        gradient={gradients.weather}
      />

      <View className="p-3.5">
        {loading && !weather ? (
          <CardLoading label="Carregando previsão do tempo..." />
        ) : !weather ? (
          <CardLoading label="Previsão indisponível no momento." />
        ) : (
          <View>
            <View className="mb-3 flex-row items-center justify-between gap-3">
              <View className="min-w-0 flex-row items-center gap-3">
                <View className="rounded-xl border border-navy-100 bg-navy-50 p-2">
                  <WeatherIcon type={weather.iconType} isDay={isDay} size={32} />
                </View>
                <View className="min-w-0">
                  <Text className="font-mono text-2xl font-black tracking-tight text-navy-950">{weather.temperature}°C</Text>
                  <Text className="font-inter-medium text-xs text-navy-600" numberOfLines={1}>
                    {weather.condition}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="mb-0.5 font-inter-semibold text-[10px] uppercase text-navy-400">Sensação</Text>
                <Text className="font-mono text-sm font-bold text-navy-800">{weather.apparentTemperature}°C</Text>
              </View>
            </View>

            <View className="mb-3 flex-row rounded-xl border border-navy-100 bg-navy-50 px-2 py-2">
              <Stat icon={<ArrowUpRight size={10} color={colors.amber600} />} label="Máx." value={`${weather.tempMax}°C`} />
              <Stat
                icon={<ArrowDownRight size={10} color={colors.cyan600} />}
                label="Mín."
                value={`${weather.tempMin}°C`}
                bordered
              />
              <Stat icon={<Droplets size={10} color={colors.blue500} />} label="Umidade" value={`${weather.humidity}%`} />
            </View>

            {upcoming.length > 0 ? (
              <View className="border-t border-navy-100 pt-2.5">
                <View className="mb-2 flex-row items-center gap-1.5">
                  <Calendar size={12} color={colors.accent} />
                  <Text className="font-inter-bold text-[10px] uppercase tracking-wider text-navy-500">Próximos Dias</Text>
                </View>
                {upcoming.map((day, i) => (
                  <View
                    key={day.date}
                    className={`flex-row items-center justify-between gap-2 py-1.5 ${i > 0 ? 'border-t border-navy-50' : ''}`}
                  >
                    <Text className="w-16 font-inter-semibold text-[11px] text-navy-800">{day.dayLabel}</Text>
                    <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
                      <WeatherIcon type={day.iconType} size={16} />
                      {day.rainProbability >= 25 ? (
                        <View className="flex-row items-center gap-0.5 rounded bg-blue-50 px-1">
                          <Droplets size={8} color={colors.blue600} />
                          <Text className="font-inter-semibold text-[9px] text-blue-600">{day.rainProbability}%</Text>
                        </View>
                      ) : null}
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Text className="font-mono text-[11px] font-bold text-navy-900">{day.tempMax}°</Text>
                      <Text className="font-mono text-[10px] text-navy-400">{day.tempMin}°</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}

            <CardFooter left="Open-Meteo • 7 dias" right={`Atualizado em ${formatDateTime(weather.updatedAt)}`} />
          </View>
        )}
      </View>
    </View>
  );
}

export function Stat({
  icon,
  label,
  value,
  valueClassName = 'text-navy-800',
  bordered = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  bordered?: boolean;
}) {
  return (
    <View className={`flex-1 items-center ${bordered ? 'border-x border-navy-100' : ''}`}>
      <View className="flex-row items-center gap-0.5">
        {icon}
        <Text className="font-inter-medium text-[9px] text-navy-400">{label}</Text>
      </View>
      <Text className={`font-mono text-[11px] font-bold ${valueClassName}`}>{value}</Text>
    </View>
  );
}
