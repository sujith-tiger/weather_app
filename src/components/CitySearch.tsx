import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2, Heart, Sparkles, Building2 } from "lucide-react";
import { CityResult, SavedCity } from "../types";

interface CitySearchProps {
  onSelectCity: (city: CityResult) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  activeCity: CityResult | null;
  savedCities: SavedCity[];
  onToggleSaveCity: (city: CityResult) => void;
}

const POPULAR_CITIES: CityResult[] = [
  { id: 2643743, name: "London", latitude: 51.50853, longitude: -0.12574, country: "United Kingdom", country_code: "GB" },
  { id: 5128581, name: "New York", latitude: 40.71427, longitude: -74.00597, country: "United States", country_code: "US" },
  { id: 1850147, name: "Tokyo", latitude: 35.6895, longitude: 139.69171, country: "Japan", country_code: "JP" },
  { id: 2988507, name: "Paris", latitude: 48.85341, longitude: 2.3488, country: "France", country_code: "FR" },
  { id: 2147714, name: "Sydney", latitude: -33.86785, longitude: 151.20732, country: "Australia", country_code: "AU" },
  { id: 292223, name: "Dubai", latitude: 25.25817, longitude: 55.30472, country: "United Arab Emirates", country_code: "AE" },
  { id: 1880252, name: "Singapore", latitude: 1.28967, longitude: 103.85007, country: "Singapore", country_code: "SG" },
  { id: 5391959, name: "San Francisco", latitude: 37.77493, longitude: -122.41942, country: "United States", country_code: "US" },
];

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
  activeCity,
  savedCities,
  onToggleSaveCity,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search for Open-Meteo Geocoding
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/geocoding?name=${encodeURIComponent(query.trim())}&count=10`);
        if (!res.ok) throw new Error("Geocoding failed");
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (err) {
        console.error("City search error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: CityResult) => {
    onSelectCity(city);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const isSaved = activeCity ? savedCities.some((c) => c.id === activeCity.id) : false;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <div className="relative flex items-center gap-2" ref={searchRef}>
        {/* Main Search Input Box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-sky-400" /> : <Search className="w-5 h-5" />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search any city, state, or country (e.g. Tokyo, Miami, London)..."
            className="w-full pl-11 pr-10 py-3 glass-input text-white placeholder-white/40 text-sm sm:text-base font-medium rounded-2xl transition-all focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Location GPS Button */}
        <button
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          title="Use GPS Current Location"
          className="flex items-center gap-2 px-4 py-3 bg-sky-500/80 hover:bg-sky-500 text-white font-medium text-sm rounded-2xl shadow-lg shadow-sky-500/20 backdrop-blur-md border border-sky-400/30 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>

        {/* Save Current Active City Toggle */}
        {activeCity && (
          <button
            onClick={() => onToggleSaveCity(activeCity)}
            title={isSaved ? "Remove from saved cities" : "Save this city"}
            className={`p-3 rounded-2xl border transition-all ${
              isSaved
                ? "bg-amber-500/20 border-amber-400/50 text-amber-400 hover:bg-amber-500/30 shadow-lg shadow-amber-500/10"
                : "glass-pill text-white/50 hover:text-amber-400 hover:border-amber-400/40"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-amber-400" : ""}`} />
          </button>
        )}

        {/* Autocomplete Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl z-50 overflow-hidden divide-y divide-white/10 shadow-2xl">
            <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/40 bg-white/5 flex items-center justify-between">
              <span>Search Results ({results.length})</span>
              <span className="text-[10px] text-sky-400">Open-Meteo Geocoding</span>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {results.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-sky-500 group-hover:text-white text-white/60 transition-colors">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">
                        {city.name}
                      </div>
                      <div className="text-xs text-white/50">
                        {[city.admin1, city.country].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono text-white/40 group-hover:text-sky-300">
                    {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular Quick Search Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-white/40 font-medium flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Popular:
        </span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
              activeCity?.id === city.id
                ? "bg-sky-500/80 text-white border border-sky-400/50 shadow-md shadow-sky-500/20 backdrop-blur-md"
                : "glass-pill text-white/70 hover:text-white hover:border-sky-400/40"
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
