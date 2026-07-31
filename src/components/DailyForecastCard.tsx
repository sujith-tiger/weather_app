import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, CloudRain, Sun, Wind, Sunrise, Sunset } from "lucide-react";
import { DailyForecastItem, UnitSystem } from "../types";
import { getWeatherInfo, getUvCategory } from "../utils/weatherCodes";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastCardProps {
  daily: DailyForecastItem[];
  unit: UnitSystem;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ daily, unit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const tempSymbol = unit === "fahrenheit" ? "°F" : "°C";
  const speedUnit = unit === "fahrenheit" ? "mph" : "km/h";

  // Calculate weekly overall min and max to draw relative temperature range bar
  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const totalRange = weekMax - weekMin || 1;

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl glass-pill text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg tracking-tight">
              7-Day Weather Forecast
            </h3>
            <p className="text-xs text-white/50">
              Extended daily projections & precipitation risks
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {daily.map((day, idx) => {
          const info = getWeatherInfo(day.weatherCode);
          const isExpanded = expandedIndex === idx;
          const uvCat = getUvCategory(day.uvIndexMax);

          // Calculate bar offsets for temp range
          const leftPercent = ((day.tempMin - weekMin) / totalRange) * 100;
          const widthPercent = Math.max(((day.tempMax - day.tempMin) / totalRange) * 100, 8);

          return (
            <div
              key={day.date}
              className="rounded-2xl glass-pill glass-card-hover overflow-hidden border border-white/10"
            >
              {/* Row item */}
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full p-4 flex items-center justify-between gap-4 text-left focus:outline-none"
              >
                {/* Day name & Date */}
                <div className="w-24 sm:w-28 shrink-0">
                  <div className="font-semibold text-white text-sm">
                    {idx === 0 ? "Today" : day.dayName}
                  </div>
                  <div className="text-[11px] text-white/40">
                    {day.date}
                  </div>
                </div>

                {/* Weather Condition Icon & Label */}
                <div className="flex items-center gap-2.5 w-32 sm:w-44 shrink-0">
                  <WeatherIcon name={info.iconName} className={`w-6 h-6 ${info.color}`} />
                  <span className="text-xs font-medium text-white/80 truncate">
                    {info.description}
                  </span>
                </div>

                {/* Rain Probability Badge */}
                <div className="hidden md:flex items-center gap-1 w-20 shrink-0">
                  {day.precipitationProbabilityMax > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-sky-400" />
                      {day.precipitationProbabilityMax}%
                    </span>
                  ) : (
                    <span className="text-[11px] text-white/30 font-medium">0% rain</span>
                  )}
                </div>

                {/* Relative Temperature Range Bar */}
                <div className="flex-1 max-w-xs items-center gap-3 hidden sm:flex">
                  <span className="text-xs font-medium text-white/50 w-9 text-right">
                    {Math.round(day.tempMin)}{tempSymbol}
                  </span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white w-9">
                    {Math.round(day.tempMax)}{tempSymbol}
                  </span>
                </div>

                {/* Mobile temp preview */}
                <div className="sm:hidden text-right">
                  <span className="text-sm font-semibold text-white">
                    {Math.round(day.tempMax)}°
                  </span>
                  <span className="text-xs text-white/40 ml-1">
                    / {Math.round(day.tempMin)}°
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <div className="text-white/40">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Detailed Breakdown Drawer */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/10 bg-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl glass-pill">
                    <span className="text-white/40 block text-[10px] uppercase font-semibold">Feels Like Range</span>
                    <span className="font-semibold text-white">
                      {Math.round(day.apparentTempMin)}{tempSymbol} to {Math.round(day.apparentTempMax)}{tempSymbol}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl glass-pill">
                    <span className="text-white/40 block text-[10px] uppercase font-semibold">UV Index Max</span>
                    <span className={`font-semibold ${uvCat.color}`}>
                      {day.uvIndexMax.toFixed(1)} ({uvCat.label})
                    </span>
                  </div>

                  <div className="p-3 rounded-xl glass-pill">
                    <span className="text-white/40 block text-[10px] uppercase font-semibold">Precipitation Sum</span>
                    <span className="font-semibold text-sky-300">
                      {day.precipitationSum} mm ({day.precipitationProbabilityMax}% max chance)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl glass-pill">
                    <span className="text-white/40 block text-[10px] uppercase font-semibold">Max Wind Speed</span>
                    <span className="font-semibold text-teal-300">
                      {Math.round(day.windSpeedMax)} {speedUnit}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
