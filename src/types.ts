export type UnitSystem = "celsius" | "fahrenheit";

export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  weatherDescription: string;
  cloudCover: number;
  pressure: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex?: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windDirectionDominant: number;
}

export interface HourlyForecastItem {
  time: string;
  formattedTime: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  pressure: number;
  cloudCover: number;
  visibility: number;
  windSpeed: number;
  uvIndex: number;
}

export interface WeatherDataResponse {
  city: CityResult;
  current: CurrentWeatherData;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  units: {
    temperature: string;
    windSpeed: string;
    precipitation: string;
  };
}

export interface AIOutfitRecommendation {
  top: string;
  bottom: string;
  footwear: string;
  accessories: string;
}

export interface AIActivityItem {
  name: string;
  rating: "Optimal" | "Great" | "Moderate" | "Poor";
  tip: string;
}

export interface AIWeatherInsights {
  summary: string;
  bestWindow: string;
  outfit: AIOutfitRecommendation;
  activities: AIActivityItem[];
  planningTips: string[];
  smartAlert?: string | null;
}

export interface SavedCity {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
