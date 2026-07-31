import React from "react";
import {
  Droplets,
  Wind,
  Gauge,
  Sun,
  Cloud,
  CloudRain,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  Eye,
  Compass,
} from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { getWeatherInfo, getWindDirectionText, getUvCategory } from "../utils/weatherCodes";
import { CurrentWeatherData, DailyForecastItem, UnitSystem } from "../types";

interface CurrentWeatherCardProps {
  current: CurrentWeatherData;
  dailyToday?: DailyForecastItem;
  cityName: string;
  countryName?: string;
  unit: UnitSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  dailyToday,
  cityName,
  countryName,
  unit,
}) => {
  const weatherInfo = getWeatherInfo(current.weatherCode);
  const windDirText = getWindDirectionText(current.windDirection);
  const tempSymbol = unit === "fahrenheit" ? "°F" : "°C";
  const speedUnit = unit === "fahrenheit" ? "mph" : "km/h";

  const uvVal = current.uvIndex ?? dailyToday?.uvIndexMax ?? 0;
  const uvCat = getUvCategory(uvVal);

  return (
    <div className="w-full rounded-3xl glass-card overflow-hidden transition-all relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Dynamic Header Banner */}
      <div className="p-6 sm:p-10 relative z-10 border-b border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Main Temp & Location */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Conditions
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-white">
              {cityName}
            </h2>
            {countryName && (
              <p className="text-sm font-medium text-white/50">{countryName}</p>
            )}

            <div className="pt-4 flex items-baseline gap-4">
              <span className="text-7xl sm:text-9xl font-extralight tracking-tighter text-white">
                {Math.round(current.temperature)}
                <span className="text-4xl sm:text-5xl font-light text-sky-400">{tempSymbol}</span>
              </span>

              <div className="space-y-1">
                <div className="text-sm sm:text-base font-medium text-white/80 flex items-center gap-1">
                  Feels like <span className="text-white font-semibold">{Math.round(current.apparentTemperature)}{tempSymbol}</span>
                </div>
                {dailyToday && (
                  <div className="flex items-center gap-3 text-xs font-medium text-white/60">
                    <span className="flex items-center text-rose-400">
                      <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                      H: {Math.round(dailyToday.tempMax)}{tempSymbol}
                    </span>
                    <span className="flex items-center text-sky-400">
                      <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                      L: {Math.round(dailyToday.tempMin)}{tempSymbol}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Condition Icon & Label */}
          <div className="flex flex-col items-start md:items-end glass-pill p-5 sm:p-6 rounded-2xl border border-white/15">
            <div className="flex items-center gap-4">
              <WeatherIcon name={weatherInfo.iconName} className={`w-14 h-14 ${weatherInfo.color}`} />
              <div>
                <div className="text-2xl font-semibold text-white">{weatherInfo.description}</div>
                <div className="text-xs font-medium text-white/50 mt-0.5">
                  {current.isDay ? "Daytime" : "Nighttime"} Weather
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
        {/* Humidity */}
        <div className="p-4 rounded-2xl glass-pill glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-widest">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {current.humidity}%
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">
              {current.humidity > 70 ? "Humid" : current.humidity < 30 ? "Dry air" : "Optimal"}
            </div>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="p-4 rounded-2xl glass-pill glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-widest">Wind</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white flex items-baseline gap-1">
              {Math.round(current.windSpeed)}
              <span className="text-xs font-normal text-white/50">{speedUnit}</span>
            </div>
            <div className="text-[11px] text-white/50 mt-0.5 flex items-center gap-1 truncate">
              <Compass className="w-3 h-3 text-teal-400 shrink-0" />
              {windDirText} ({current.windDirection}°)
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-4 rounded-2xl glass-pill glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-widest">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {uvVal.toFixed(1)}
            </div>
            <span className={`inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold border ${uvCat.badge}`}>
              {uvCat.label}
            </span>
          </div>
        </div>

        {/* Pressure */}
        <div className="p-4 rounded-2xl glass-pill glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-widest">Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {Math.round(current.pressure)}
              <span className="text-xs font-normal text-white/50 ml-1">hPa</span>
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">
              {current.pressure > 1013 ? "High Pressure" : "Low Pressure"}
            </div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-4 rounded-2xl glass-pill glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-widest">Cloud Cover</span>
            <Cloud className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {current.cloudCover}%
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">
              {current.cloudCover > 80 ? "Overcast" : current.cloudCover > 30 ? "Partly Cloudy" : "Mostly Clear"}
            </div>
          </div>
        </div>

        {/* Rain / Precip */}
        <div className="p-4 rounded-2xl glass-pill glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-widest">Precipitation</span>
            <CloudRain className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {dailyToday ? `${dailyToday.precipitationProbabilityMax}%` : `${current.precipitation} mm`}
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">
              {dailyToday ? `${dailyToday.precipitationSum} mm sum` : "Current precip"}
            </div>
          </div>
        </div>
      </div>

      {/* Sun Schedule Bar */}
      {dailyToday && (
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-around text-xs text-white/70 relative z-10">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <span>Sunrise: <strong className="text-white">{dailyToday.sunrise.split("T")[1]?.slice(0, 5) || dailyToday.sunrise}</strong></span>
          </div>
          <div className="hidden sm:block text-white/20">•</div>
          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-orange-400" />
            <span>Sunset: <strong className="text-white">{dailyToday.sunset.split("T")[1]?.slice(0, 5) || dailyToday.sunset}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
