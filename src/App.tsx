/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { CitySearch } from "./components/CitySearch";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecastCard } from "./components/DailyForecastCard";
import { AIPlanningCard } from "./components/AIPlanningCard";
import { SavedLocationsDrawer } from "./components/SavedLocationsDrawer";
import {
  CityResult,
  WeatherDataResponse,
  UnitSystem,
  SavedCity,
  AIWeatherInsights,
  DailyForecastItem,
  HourlyForecastItem,
  CurrentWeatherData,
} from "./types";
import { getWeatherInfo } from "./utils/weatherCodes";
import { Loader2, AlertCircle, RefreshCw, Compass } from "lucide-react";

const DEFAULT_CITY: CityResult = {
  id: 2643743,
  name: "London",
  latitude: 51.50853,
  longitude: -0.12574,
  country: "United Kingdom",
  country_code: "GB",
};

export default function App() {
  const [activeCity, setActiveCity] = useState<CityResult>(DEFAULT_CITY);
  const [unit, setUnit] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem("weather_intel_unit");
    return (saved as UnitSystem) || "celsius";
  });
  const [savedCities, setSavedCities] = useState<SavedCity[]>(() => {
    try {
      const saved = localStorage.getItem("weather_intel_saved_cities");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherDataResponse | null>(null);
  const [aiInsights, setAiInsights] = useState<AIWeatherInsights | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);

  // Persist units
  useEffect(() => {
    localStorage.setItem("weather_intel_unit", unit);
  }, [unit]);

  // Persist saved cities
  useEffect(() => {
    localStorage.setItem("weather_intel_saved_cities", JSON.stringify(savedCities));
  }, [savedCities]);

  // Fetch Weather Data from API
  const fetchWeather = useCallback(
    async (city: CityResult, currentUnit: UnitSystem) => {
      setIsLoadingWeather(true);
      setWeatherError(null);
      try {
        const tempParam = currentUnit === "fahrenheit" ? "fahrenheit" : "celsius";
        const windParam = currentUnit === "fahrenheit" ? "mph" : "kmh";
        let res = await fetch(
          `/api/forecast?latitude=${city.latitude}&longitude=${city.longitude}&temperature_unit=${tempParam}&wind_speed_unit=${windParam}`
        );

        if (!res.ok) {
          // Direct fallback to Open-Meteo public API if proxy returns 404/error
          const currentParams = [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "rain",
            "showers",
            "snowfall",
            "weather_code",
            "cloud_cover",
            "pressure_msl",
            "surface_pressure",
            "wind_speed_10m",
            "wind_direction_10m",
            "wind_gusts_10m",
          ].join(",");

          const dailyParams = [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "apparent_temperature_max",
            "apparent_temperature_min",
            "sunrise",
            "sunset",
            "uv_index_max",
            "precipitation_sum",
            "rain_sum",
            "showers_sum",
            "snowfall_sum",
            "precipitation_hours",
            "precipitation_probability_max",
            "wind_speed_10m_max",
            "wind_gusts_10m_max",
            "wind_direction_10m_dominant",
          ].join(",");

          const hourlyParams = [
            "temperature_2m",
            "relative_humidity_2m",
            "dew_point_2m",
            "apparent_temperature",
            "precipitation_probability",
            "precipitation",
            "weather_code",
            "pressure_msl",
            "cloud_cover",
            "visibility",
            "wind_speed_10m",
            "uv_index",
          ].join(",");

          const fallbackUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=${currentParams}&daily=${dailyParams}&hourly=${hourlyParams}&temperature_unit=${tempParam}&wind_speed_unit=${windParam}&precipitation_unit=mm&timezone=auto`;
          res = await fetch(fallbackUrl);
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch weather data (${res.status})`);
        }

        const data = await res.json();

        // Process current weather
        const currentRaw = data.current;
        const current: CurrentWeatherData = {
          temperature: currentRaw.temperature_2m,
          apparentTemperature: currentRaw.apparent_temperature,
          humidity: currentRaw.relative_humidity_2m,
          isDay: currentRaw.is_day === 1,
          precipitation: currentRaw.precipitation,
          rain: currentRaw.rain,
          showers: currentRaw.showers,
          snowfall: currentRaw.snowfall,
          weatherCode: currentRaw.weather_code,
          weatherDescription: getWeatherInfo(currentRaw.weather_code).description,
          cloudCover: currentRaw.cloud_cover,
          pressure: currentRaw.pressure_msl || currentRaw.surface_pressure,
          surfacePressure: currentRaw.surface_pressure,
          windSpeed: currentRaw.wind_speed_10m,
          windDirection: currentRaw.wind_direction_10m,
          windGusts: currentRaw.wind_gusts_10m,
          uvIndex: data.hourly?.uv_index?.[0] || 0,
        };

        // Process daily forecast
        const dailyRaw = data.daily;
        const daily: DailyForecastItem[] = (dailyRaw.time || []).map((dateStr: string, idx: number) => {
          const d = new Date(dateStr + "T00:00:00");
          const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
          return {
            date: dateStr,
            dayName,
            weatherCode: dailyRaw.weather_code[idx],
            weatherDescription: getWeatherInfo(dailyRaw.weather_code[idx]).description,
            tempMax: dailyRaw.temperature_2m_max[idx],
            tempMin: dailyRaw.temperature_2m_min[idx],
            apparentTempMax: dailyRaw.apparent_temperature_max[idx],
            apparentTempMin: dailyRaw.apparent_temperature_min[idx],
            sunrise: dailyRaw.sunrise[idx],
            sunset: dailyRaw.sunset[idx],
            uvIndexMax: dailyRaw.uv_index_max[idx],
            precipitationSum: dailyRaw.precipitation_sum[idx],
            precipitationProbabilityMax: dailyRaw.precipitation_probability_max[idx] || 0,
            windSpeedMax: dailyRaw.wind_speed_10m_max[idx],
            windDirectionDominant: dailyRaw.wind_direction_10m_dominant[idx],
          };
        });

        // Process hourly forecast
        const hourlyRaw = data.hourly;
        const hourly: HourlyForecastItem[] = (hourlyRaw.time || []).map((timeStr: string, idx: number) => {
          const d = new Date(timeStr);
          const formattedTime = d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
          return {
            time: timeStr,
            formattedTime,
            temperature: hourlyRaw.temperature_2m[idx],
            apparentTemperature: hourlyRaw.apparent_temperature[idx],
            humidity: hourlyRaw.relative_humidity_2m[idx],
            precipitationProbability: hourlyRaw.precipitation_probability[idx] || 0,
            precipitation: hourlyRaw.precipitation[idx] || 0,
            weatherCode: hourlyRaw.weather_code[idx],
            pressure: hourlyRaw.pressure_msl[idx],
            cloudCover: hourlyRaw.cloud_cover[idx],
            visibility: hourlyRaw.visibility ? hourlyRaw.visibility[idx] / 1000 : 10,
            windSpeed: hourlyRaw.wind_speed_10m[idx],
            uvIndex: hourlyRaw.uv_index ? hourlyRaw.uv_index[idx] : 0,
          };
        });

        const fullData: WeatherDataResponse = {
          city,
          current,
          daily,
          hourly,
          units: {
            temperature: currentUnit === "fahrenheit" ? "°F" : "°C",
            windSpeed: currentUnit === "fahrenheit" ? "mph" : "km/h",
            precipitation: "mm",
          },
        };

        setWeatherData(fullData);
        // Automatically fetch AI Insights
        fetchAIInsights(city.name, city.country, current, daily[0], currentUnit);
      } catch (err: any) {
        console.error("Fetch weather error:", err);
        setWeatherError(err.message || "Failed to load weather data");
      } finally {
        setIsLoadingWeather(false);
      }
    },
    []
  );

  // Fetch AI Insights from server-side Gemini API
  const fetchAIInsights = async (
    locationName: string,
    country?: string,
    current?: CurrentWeatherData,
    dailyToday?: DailyForecastItem,
    currentUnit: UnitSystem = unit
  ) => {
    if (!current) return;
    setIsLoadingAi(true);
    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationName,
          country,
          current,
          daily: dailyToday,
          unit: currentUnit,
        }),
      });

      if (!res.ok) throw new Error("AI Insights endpoint unavailable");
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.error("AI Insights Error:", err);
      // Fallback local weather insights
      const isFahrenheit = currentUnit === "fahrenheit";
      const isCold = isFahrenheit ? current.temperature < 60 : current.temperature < 15;
      const isHot = isFahrenheit ? current.temperature > 82 : current.temperature > 28;

      setAiInsights({
        summary: `Conditions in ${locationName} feature ${current.weatherDescription.toLowerCase()} with temperatures around ${Math.round(current.temperature)}°${isFahrenheit ? "F" : "C"}.`,
        bestWindow: "10:00 AM - 4:00 PM for outdoor movement",
        outfit: {
          top: isCold ? "Layered jacket or thermal sweater" : isHot ? "Breathable linen shirt or tee" : "Light jacket or casual shirt",
          bottom: isHot ? "Breathable shorts or light chinos" : "Comfortable pants or denim",
          footwear: current.precipitation > 0 ? "Waterproof boots or shoes" : "Comfortable walking sneakers",
          accessories: current.uvIndex > 5 ? "UV-blocking sunglasses & SPF 30+" : current.precipitation > 0 ? "Compact umbrella" : "Polarized sunglasses",
        },
        activities: [
          { name: "Outdoor Jogging", rating: current.precipitation > 0 ? "Moderate" : "Optimal", tip: current.precipitation > 0 ? "Wet ground, wear traction shoes" : "Ideal temperature for cardio" },
          { name: "Cycling & Commute", rating: current.windSpeed > 25 ? "Moderate" : "Great", tip: current.windSpeed > 25 ? "Bustling wind gusts expected" : "Smooth commuting conditions" },
          { name: "Café & Outdoor Dining", rating: "Optimal", tip: "Great atmospheric vibe today" },
          { name: "Photography", rating: "Great", tip: "Soft lighting conditions for landscapes" },
        ],
        planningTips: [
          "Monitor wind speed changes throughout the afternoon.",
          "Keep hydrated during extended outdoor activity.",
        ],
        smartAlert: current.precipitation > 5 ? "Precipitation expected today. Stay prepared!" : null,
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Initial weather load
  useEffect(() => {
    fetchWeather(activeCity, unit);
  }, [activeCity, unit, fetchWeather]);

  // Geolocation handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          // Reverse geocode via Open-Meteo
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(
              2
            )}&count=1`
          );
          let cityName = "Your Location";
          let country = "";
          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              cityName = data.results[0].name;
              country = data.results[0].country;
            }
          }
          const userCity: CityResult = {
            id: Date.now(),
            name: cityName,
            latitude: lat,
            longitude: lon,
            country,
          };
          setActiveCity(userCity);
        } catch (e) {
          const userCity: CityResult = {
            id: Date.now(),
            name: "Current Location",
            latitude: lat,
            longitude: lon,
          };
          setActiveCity(userCity);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setIsLocating(false);
        alert("Unable to retrieve location. Please check browser permissions.");
      }
    );
  };

  // Toggle Save City
  const handleToggleSaveCity = (city: CityResult) => {
    setSavedCities((prev) => {
      const exists = prev.some((c) => c.id === city.id);
      if (exists) {
        return prev.filter((c) => c.id !== city.id);
      } else {
        return [
          ...prev,
          {
            id: city.id,
            name: city.name,
            country: city.country,
            admin1: city.admin1,
            latitude: city.latitude,
            longitude: city.longitude,
          },
        ];
      }
    });
  };

  const handleRemoveSavedCity = (id: number) => {
    setSavedCities((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAllSaved = () => {
    setSavedCities([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors antialiased pb-16">
      {/* Top Navbar */}
      <Navbar
        unit={unit}
        onToggleUnit={(newUnit) => setUnit(newUnit)}
        savedCities={savedCities}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onRefresh={() => fetchWeather(activeCity, unit)}
        isRefreshing={isLoadingWeather}
        activeCityName={activeCity.name}
        activeCountry={activeCity.country}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* City Search Bar */}
        <CitySearch
          onSelectCity={(city) => setActiveCity(city)}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          activeCity={activeCity}
          savedCities={savedCities}
          onToggleSaveCity={handleToggleSaveCity}
        />

        {/* Error State */}
        {weatherError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1 text-sm font-medium">{weatherError}</div>
            <button
              onClick={() => fetchWeather(activeCity, unit)}
              className="px-3 py-1 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Loading State */}
        {isLoadingWeather && !weatherData ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Fetching Open-Meteo weather parameters for {activeCity.name}...
            </p>
          </div>
        ) : weatherData ? (
          <div className="space-y-6">
            {/* Current Weather Hero */}
            <CurrentWeatherCard
              current={weatherData.current}
              dailyToday={weatherData.daily[0]}
              cityName={weatherData.city.name}
              countryName={weatherData.city.country}
              unit={unit}
            />

            {/* AI Weather Intelligence & Activity Planning */}
            <AIPlanningCard
              insights={aiInsights}
              isLoading={isLoadingAi}
              onRefreshInsights={() =>
                fetchAIInsights(
                  weatherData.city.name,
                  weatherData.city.country,
                  weatherData.current,
                  weatherData.daily[0],
                  unit
                )
              }
              locationName={weatherData.city.name}
            />

            {/* 24-Hour Interactive Forecast */}
            <HourlyForecast hourly={weatherData.hourly} unit={unit} />

            {/* 7-Day Extended Forecast */}
            <DailyForecastCard daily={weatherData.daily} unit={unit} />
          </div>
        ) : null}
      </main>

      {/* Saved Cities Slide-over Drawer */}
      <SavedLocationsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedCities={savedCities}
        onSelectCity={(city) => setActiveCity(city)}
        onRemoveCity={handleRemoveSavedCity}
        onClearAll={handleClearAllSaved}
        activeCityId={activeCity.id}
      />
    </div>
  );
}
