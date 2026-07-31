import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock, Thermometer, CloudRain, Wind, Droplets } from "lucide-react";
import { HourlyForecastItem, UnitSystem } from "../types";
import { getWeatherInfo } from "../utils/weatherCodes";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
}

type MetricType = "temp" | "rain" | "wind" | "humidity";

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>("temp");

  // Take the next 24 hours
  const next24Hours = hourly.slice(0, 24);

  const tempSymbol = unit === "fahrenheit" ? "°F" : "°C";
  const speedUnit = unit === "fahrenheit" ? "mph" : "km/h";

  // Chart data formatting
  const chartData = next24Hours.map((item) => ({
    time: item.formattedTime,
    temperature: Math.round(item.temperature),
    apparentTemperature: Math.round(item.apparentTemperature),
    precipitationProbability: item.precipitationProbability,
    precipitation: item.precipitation,
    windSpeed: Math.round(item.windSpeed),
    humidity: item.humidity,
  }));

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl glass-pill text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg tracking-tight">
              Hourly Forecast
            </h3>
            <p className="text-xs text-white/50">
              Interactive 24-hour atmospheric trajectory
            </p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 glass-pill p-1.5 rounded-2xl border border-white/10 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveMetric("temp")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeMetric === "temp"
                ? "bg-sky-500/80 text-white shadow-md shadow-sky-500/20 backdrop-blur-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temperature
          </button>
          <button
            onClick={() => setActiveMetric("rain")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeMetric === "rain"
                ? "bg-blue-500/80 text-white shadow-md shadow-blue-500/20 backdrop-blur-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Rain %
          </button>
          <button
            onClick={() => setActiveMetric("wind")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeMetric === "wind"
                ? "bg-teal-500/80 text-white shadow-md shadow-teal-500/20 backdrop-blur-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind
          </button>
          <button
            onClick={() => setActiveMetric("humidity")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeMetric === "humidity"
                ? "bg-indigo-500/80 text-white shadow-md shadow-indigo-500/20 backdrop-blur-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Humidity
          </button>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === "temp" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} unit={tempSymbol} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card text-white px-3.5 py-2.5 rounded-2xl text-xs shadow-2xl border border-white/20">
                        <p className="font-semibold text-white/90">{label}</p>
                        <p className="text-sky-300 font-bold mt-1">Temp: {payload[0].value}{tempSymbol}</p>
                        <p className="text-white/50">Feels: {payload[1]?.value}{tempSymbol}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="temperature" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
              <Area type="monotone" dataKey="apparentTemperature" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="3 3" fill="none" />
            </AreaChart>
          ) : activeMetric === "rain" ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card text-white px-3.5 py-2.5 rounded-2xl text-xs shadow-2xl border border-white/20">
                        <p className="font-semibold text-white/90">{label}</p>
                        <p className="text-blue-300 font-bold mt-1">Rain Chance: {payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="precipitationProbability" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : activeMetric === "wind" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} unit={` ${speedUnit}`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card text-white px-3.5 py-2.5 rounded-2xl text-xs shadow-2xl border border-white/20">
                        <p className="font-semibold text-white/90">{label}</p>
                        <p className="text-teal-300 font-bold mt-1">Wind: {payload[0].value} {speedUnit}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="windSpeed" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#windGradient)" />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card text-white px-3.5 py-2.5 rounded-2xl text-xs shadow-2xl border border-white/20">
                        <p className="font-semibold text-white/90">{label}</p>
                        <p className="text-indigo-300 font-bold mt-1">Humidity: {payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="humidity" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#humGradient)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Horizontal Cards Slider */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {next24Hours.map((item, idx) => {
          const info = getWeatherInfo(item.weatherCode);
          return (
            <div
              key={idx}
              className="flex-shrink-0 w-24 p-3.5 rounded-2xl glass-pill glass-card-hover flex flex-col items-center justify-between gap-2 text-center"
            >
              <span className="text-xs font-medium text-white/60">
                {item.formattedTime}
              </span>
              <WeatherIcon name={info.iconName} className={`w-7 h-7 ${info.color}`} />
              <div className="text-sm font-semibold text-white">
                {Math.round(item.temperature)}{tempSymbol}
              </div>
              {item.precipitationProbability > 0 && (
                <div className="text-[10px] font-semibold text-sky-300 bg-sky-500/20 border border-sky-400/30 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <CloudRain className="w-2.5 h-2.5" />
                  {item.precipitationProbability}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
