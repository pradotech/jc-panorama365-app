import { useEffect, useState } from 'react';
import { fetchWeatherData } from '@/services/weatherService';
import type { WeatherData } from '@/types/weather';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchWeatherData()
      .then((data) => {
        if (mounted) setWeather(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { weather, loading };
}
