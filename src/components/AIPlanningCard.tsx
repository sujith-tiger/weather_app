import React from "react";
import { Sparkles, Shirt, Activity, Compass, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { AIWeatherInsights } from "../types";

interface AIPlanningCardProps {
  insights: AIWeatherInsights | null;
  isLoading: boolean;
  onRefreshInsights: () => void;
  locationName: string;
}

export const AIPlanningCard: React.FC<AIPlanningCardProps> = ({
  insights,
  isLoading,
  onRefreshInsights,
  locationName,
}) => {
  const getRatingBadgeClass = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "optimal":
      case "excellent":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "great":
      case "good":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
      case "moderate":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      default:
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl glass-pill text-sky-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xl tracking-tight text-white">
                Weather Intelligence <span className="text-sky-400 font-light">& AI Planning</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-white/50">
              Personalized activity recommendations & outfit guidance for {locationName}
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 glass-pill hover:bg-white/15 text-white/90 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-400" : ""}`} />
          {isLoading ? "Analyzing..." : "Re-analyze Weather"}
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-sky-400 absolute inset-0 m-auto" />
          </div>
          <p className="text-sm font-semibold text-white/70">
            Synthesizing meteorological parameters & activity planning...
          </p>
        </div>
      ) : insights ? (
        <div className="relative z-10 space-y-6">
          {/* Smart Alert Banner if exists */}
          {insights.smartAlert && (
            <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-200 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-300 block mb-0.5">Atmospheric Alert:</strong>
                {insights.smartAlert}
              </div>
            </div>
          )}

          {/* Vibe & Best Outdoor Window */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4.5 rounded-2xl glass-pill space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-400">
                Atmospheric Summary
              </span>
              <p className="text-sm font-medium text-white/90 leading-relaxed">
                "{insights.summary}"
              </p>
            </div>

            <div className="p-4.5 rounded-2xl glass-pill space-y-1.5 border-l-4 border-sky-400">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                Best Activity Window
              </span>
              <div className="text-base font-semibold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                {insights.bestWindow}
              </div>
            </div>
          </div>

          {/* What to Wear Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
              <Shirt className="w-4 h-4 text-indigo-400" />
              <span>Recommended Outfit & Gear</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl glass-pill glass-card-hover">
                <span className="text-white/40 block text-[10px] uppercase font-semibold">Top Layer</span>
                <span className="font-semibold text-white mt-1 block">{insights.outfit.top}</span>
              </div>
              <div className="p-3.5 rounded-2xl glass-pill glass-card-hover">
                <span className="text-white/40 block text-[10px] uppercase font-semibold">Bottom Layer</span>
                <span className="font-semibold text-white mt-1 block">{insights.outfit.bottom}</span>
              </div>
              <div className="p-3.5 rounded-2xl glass-pill glass-card-hover">
                <span className="text-white/40 block text-[10px] uppercase font-semibold">Footwear</span>
                <span className="font-semibold text-white mt-1 block">{insights.outfit.footwear}</span>
              </div>
              <div className="p-3.5 rounded-2xl glass-pill glass-card-hover">
                <span className="text-white/40 block text-[10px] uppercase font-semibold">Essential Accessories</span>
                <span className="font-semibold text-sky-300 mt-1 block">{insights.outfit.accessories}</span>
              </div>
            </div>
          </div>

          {/* Activity Index Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Outdoor Activity Index</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {insights.activities.map((act, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl glass-pill glass-card-hover flex flex-col justify-between space-y-2 border-l-4 border-emerald-500/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{act.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRatingBadgeClass(act.rating)}`}>
                      {act.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-snug">{act.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Planning & Commute Tips */}
          {insights.planningTips && insights.planningTips.length > 0 && (
            <div className="p-4.5 rounded-2xl glass-pill space-y-2 border-l-4 border-indigo-400">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest block">
                Commute & Planning Recommendations
              </span>
              <ul className="space-y-1.5 text-xs text-white/80">
                {insights.planningTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
