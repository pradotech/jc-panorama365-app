export type WeatherIconType =
  | 'sun'
  | 'sun-cloud'
  | 'cloud-sun'
  | 'cloud'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'rain-heavy'
  | 'thunder';

export interface WeatherForecastDay {
  date: string;
  dayLabel: string;
  isToday: boolean;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  weatherCode: number;
  condition: string;
  iconType: WeatherIconType;
}

export interface WeatherData {
  city: string;
  temperature: number;
  apparentTemperature: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  weatherCode: number;
  condition: string;
  iconType: WeatherIconType;
  isDay: boolean;
  forecast: WeatherForecastDay[];
  updatedAt: string;
}

export interface WeatherCoords {
  city: string;
  latitude: number;
  longitude: number;
}
