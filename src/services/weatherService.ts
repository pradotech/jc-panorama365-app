import { readCache, writeCache } from '@/lib/cache';
import type { WeatherCoords, WeatherData, WeatherForecastDay, WeatherIconType } from '@/types/weather';

/**
 * Previsão do tempo via Open-Meteo (gratuita, sem chave).
 * Coordenadas padrão: Jundiaí - SP.
 */
const DEFAULT_COORDS: WeatherCoords = { city: 'Jundiaí, SP', latitude: -23.1857, longitude: -46.8978 };

const CACHE_KEY = 'jc_weather_cache_v2';
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 horas

interface WmoInfo {
  label: string;
  icon: WeatherIconType;
}

const WMO_CODES: Record<number, WmoInfo> = {
  0: { label: 'Céu limpo', icon: 'sun' },
  1: { label: 'Predominantemente limpo', icon: 'sun-cloud' },
  2: { label: 'Parcialmente nublado', icon: 'cloud-sun' },
  3: { label: 'Nublado', icon: 'cloud' },
  45: { label: 'Nevoeiro', icon: 'fog' },
  48: { label: 'Nevoeiro com geada', icon: 'fog' },
  51: { label: 'Garoa leve', icon: 'drizzle' },
  53: { label: 'Garoa moderada', icon: 'drizzle' },
  55: { label: 'Garoa densa', icon: 'drizzle' },
  61: { label: 'Chuva fraca', icon: 'rain' },
  63: { label: 'Chuva moderada', icon: 'rain' },
  65: { label: 'Chuva forte', icon: 'rain-heavy' },
  80: { label: 'Pancadas de chuva', icon: 'rain' },
  81: { label: 'Pancadas moderadas', icon: 'rain' },
  82: { label: 'Chuva torrencial', icon: 'rain-heavy' },
  95: { label: 'Tempestade com trovoadas', icon: 'thunder' },
  96: { label: 'Tempestade com granizo', icon: 'thunder' },
  99: { label: 'Tempestade severa', icon: 'thunder' },
};

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    is_day?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
  };
}

function dayLabelFor(dateStr: string, index: number): string {
  if (index === 0) return 'Hoje';
  if (index === 1) return 'Amanhã';
  try {
    const weekday = new Date(`${dateStr}T12:00:00`)
      .toLocaleDateString('pt-BR', { weekday: 'short' })
      .replace('.', '');
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  } catch {
    return `Dia ${index + 1}`;
  }
}

export async function fetchWeatherData(coords: WeatherCoords = DEFAULT_COORDS): Promise<WeatherData | null> {
  const cached = readCache<CachedWeather>(CACHE_KEY);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) return cached.data;

  try {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'America/Sao_Paulo',
      forecast_days: '7',
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Open-Meteo ${response.status}`);

    const json = (await response.json()) as OpenMeteoResponse;
    const current = json.current ?? {};
    const daily = json.daily ?? {};
    const code = current.weather_code ?? 0;
    const wmo = WMO_CODES[code] ?? { label: 'Tempo estável', icon: 'sun' };
    const baseTemp = current.temperature_2m ?? 24;

    const forecast: WeatherForecastDay[] = (daily.time ?? []).map((dateStr, i) => {
      const dayCode = daily.weather_code?.[i] ?? 0;
      const dayWmo = WMO_CODES[dayCode] ?? { label: 'Estável', icon: 'sun' };
      return {
        date: dateStr,
        dayLabel: dayLabelFor(dateStr, i),
        isToday: i === 0,
        tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 26),
        tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 18),
        rainProbability: Math.round(daily.precipitation_probability_max?.[i] ?? 10),
        weatherCode: dayCode,
        condition: dayWmo.label,
        iconType: dayWmo.icon,
      };
    });

    const data: WeatherData = {
      city: coords.city,
      temperature: Math.round(baseTemp),
      apparentTemperature: Math.round(current.apparent_temperature ?? baseTemp),
      tempMax: Math.round(daily.temperature_2m_max?.[0] ?? baseTemp + 4),
      tempMin: Math.round(daily.temperature_2m_min?.[0] ?? baseTemp - 4),
      humidity: Math.round(current.relative_humidity_2m ?? 65),
      windSpeed: Math.round(current.wind_speed_10m ?? 10),
      rainProbability: Math.round(daily.precipitation_probability_max?.[0] ?? 15),
      weatherCode: code,
      condition: wmo.label,
      iconType: wmo.icon,
      isDay: Boolean(current.is_day ?? 1),
      forecast,
      updatedAt: new Date().toISOString(),
    };

    writeCache<CachedWeather>(CACHE_KEY, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.warn('Erro ao carregar clima:', error);
    // Sem dados falsos: usa o último cache (mesmo expirado) ou oculta o card
    return cached?.data ?? null;
  }
}
