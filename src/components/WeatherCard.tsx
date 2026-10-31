import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSun,
  Droplets,
  Sun,
  Wind,
  type LucideIcon,
} from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useWeather } from '@/hooks/useWeather';
import type { WeatherIconType } from '@/types/weather';

const ICONS: Record<WeatherIconType, LucideIcon> = {
  sun: Sun,
  'sun-cloud': CloudSun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  'rain-heavy': CloudRainWind,
  thunder: CloudLightning,
};

export function WeatherCard() {
  const { weather } = useWeather();
  if (!weather) return null;

  const Icon = ICONS[weather.iconType];

  return (
    <View className="rounded-xl border border-navy-100 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-wider text-navy-400">{weather.city}</Text>
          <View className="mt-1 flex-row items-end gap-1">
            <Text className="text-4xl font-bold text-navy-950">{weather.temperature}°</Text>
            <Text className="mb-1.5 text-sm text-navy-500">
              {weather.tempMax}° / {weather.tempMin}°
            </Text>
          </View>
          <Text className="text-sm text-navy-700">{weather.condition}</Text>
        </View>
        <Icon size={48} color={colors.accent} strokeWidth={1.5} />
      </View>

      <View className="mt-3 flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <Droplets size={14} color={colors.navy400} />
          <Text className="text-xs text-navy-500">{weather.humidity}%</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Wind size={14} color={colors.navy400} />
          <Text className="text-xs text-navy-500">{weather.windSpeed} km/h</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <CloudRain size={14} color={colors.navy400} />
          <Text className="text-xs text-navy-500">{weather.rainProbability}%</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4" contentContainerClassName="gap-2">
        {weather.forecast.slice(1).map((day) => {
          const DayIcon = ICONS[day.iconType];
          return (
            <View key={day.date} className="w-16 items-center rounded-lg bg-navy-50 py-2">
              <Text className="text-[11px] font-semibold text-navy-500">{day.dayLabel}</Text>
              <View className="my-1">
                <DayIcon size={20} color={colors.navy700} strokeWidth={1.75} />
              </View>
              <Text className="text-xs font-bold text-navy-950">{day.tempMax}°</Text>
              <Text className="text-[11px] text-navy-400">{day.tempMin}°</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
