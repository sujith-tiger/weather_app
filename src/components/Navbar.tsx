import React, { useState, useEffect } from "react";
import { CloudSun, Bookmark, Compass, RefreshCw } from "lucide-react";
import { UnitSystem, SavedCity } from "../types";

interface NavbarProps {
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  savedCities: SavedCity[];
  onOpenSavedDrawer: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeCityName?: string;
  activeCountry?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  savedCities,
  onOpenSavedDrawer,
  onRefresh,
  isRefreshing,
  activeCityName,
  activeCountry,
}) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/40 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl glass-pill flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-lg tracking-tight">
                Weather <span className="text-sky-400 font-light">Intelligence</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                Live Open-Meteo
              </span>
            </div>
            {activeCityName && (
              <p className="text-xs text-white/50 flex items-center gap-1 truncate max-w-[200px] sm:max-w-xs">
                <Compass className="w-3 h-3 text-sky-400" />
                {activeCityName}
                {activeCountry ? `, ${activeCountry}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Time badge */}
          <div className="hidden md:flex flex-col items-end text-xs text-white/70 font-mono glass-pill px-3 py-1.5 rounded-xl border border-white/10">
            <span>{currentTime || "00:00:00"}</span>
            <span className="text-[10px] text-white/40">Local Time</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh weather data"
            className="p-2.5 text-white/80 hover:text-white glass-pill hover:bg-white/15 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-sky-400" : ""}`} />
          </button>

          {/* Unit Toggle (°C / °F) */}
          <div className="flex items-center glass-pill p-1 rounded-xl border border-white/10">
            <button
              onClick={() => onToggleUnit("celsius")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === "celsius"
                  ? "bg-sky-500/80 text-white shadow-md shadow-sky-500/20 backdrop-blur-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit("fahrenheit")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === "fahrenheit"
                  ? "bg-sky-500/80 text-white shadow-md shadow-sky-500/20 backdrop-blur-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              °F
            </button>
          </div>

          {/* Saved Cities Drawer Toggle */}
          <button
            onClick={onOpenSavedDrawer}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/90 glass-pill hover:bg-white/15 rounded-xl border border-white/10 transition-all"
          >
            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="hidden sm:inline">Saved</span>
            {savedCities.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {savedCities.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
