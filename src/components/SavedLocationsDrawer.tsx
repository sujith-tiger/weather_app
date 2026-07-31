import React from "react";
import { X, Bookmark, Trash2, MapPin, Building2, ChevronRight } from "lucide-react";
import { SavedCity, CityResult } from "../types";

interface SavedLocationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCities: SavedCity[];
  onSelectCity: (city: CityResult) => void;
  onRemoveCity: (id: number) => void;
  onClearAll: () => void;
  activeCityId?: number;
}

export const SavedLocationsDrawer: React.FC<SavedLocationsDrawerProps> = ({
  isOpen,
  onClose,
  savedCities,
  onSelectCity,
  onRemoveCity,
  onClearAll,
  activeCityId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md glass-card h-full shadow-2xl border-l border-white/20 flex flex-col justify-between transition-all animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl glass-pill text-amber-400">
              <Bookmark className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg tracking-tight">
                Saved Cities
              </h3>
              <p className="text-xs text-white/50">
                {savedCities.length} favorite locations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl glass-pill hover:bg-white/15"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-none">
          {savedCities.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full glass-pill text-white/40 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white/80">
                No saved cities yet
              </p>
              <p className="text-xs text-white/40 max-w-xs mx-auto">
                Click the bookmark icon next to any city search to save your favorite weather destinations.
              </p>
            </div>
          ) : (
            savedCities.map((city) => {
              const isActive = activeCityId === city.id;
              return (
                <div
                  key={city.id}
                  className={`group p-4 rounded-2xl transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? "glass-card bg-sky-500/20 border-sky-400/50 shadow-lg shadow-sky-500/10"
                      : "glass-pill glass-card-hover border-white/10"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectCity({
                        id: city.id,
                        name: city.name,
                        latitude: city.latitude,
                        longitude: city.longitude,
                        country: city.country,
                        admin1: city.admin1,
                      });
                      onClose();
                    }}
                    className="flex-1 text-left flex items-center gap-3"
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive
                          ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                          : "glass-pill text-white/60 group-hover:bg-sky-500 group-hover:text-white"
                      } transition-colors`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm flex items-center gap-2">
                        {city.name}
                        {isActive && (
                          <span className="text-[10px] font-bold bg-sky-500/80 text-white px-2 py-0.5 rounded-full border border-sky-400/40">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/40">
                        {[city.admin1, city.country].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRemoveCity(city.id)}
                      title="Remove city"
                      className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedCities.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/20">
            <button
              onClick={onClearAll}
              className="w-full py-2.5 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-xl border border-rose-500/30 transition-all"
            >
              Clear All Saved Cities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
