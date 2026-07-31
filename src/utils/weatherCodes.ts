export interface WeatherCodeInfo {
  description: string;
  iconName: string; // Lucide icon identifier
  color: string; // Tailwind text color class
  bgGradient: string; // Dynamic background for current weather card
  cardBg: string; // Tailwind bg for weather cards
}

export const WMO_CODES: Record<number, WeatherCodeInfo> = {
  0: {
    description: "Clear Sky",
    iconName: "Sun",
    color: "text-amber-500",
    bgGradient: "from-sky-400 via-amber-200 to-sky-100",
    cardBg: "bg-amber-500/10 border-amber-500/20",
  },
  1: {
    description: "Mainly Clear",
    iconName: "SunDim",
    color: "text-amber-400",
    bgGradient: "from-sky-400 via-sky-200 to-amber-100",
    cardBg: "bg-sky-500/10 border-sky-500/20",
  },
  2: {
    description: "Partly Cloudy",
    iconName: "CloudSun",
    color: "text-sky-500",
    bgGradient: "from-blue-400 via-sky-300 to-slate-100",
    cardBg: "bg-sky-500/10 border-sky-500/20",
  },
  3: {
    description: "Overcast",
    iconName: "Cloud",
    color: "text-slate-500",
    bgGradient: "from-slate-500 via-slate-400 to-slate-200",
    cardBg: "bg-slate-500/10 border-slate-500/20",
  },
  45: {
    description: "Foggy",
    iconName: "CloudFog",
    color: "text-slate-400",
    bgGradient: "from-slate-400 via-zinc-300 to-slate-100",
    cardBg: "bg-slate-400/10 border-slate-400/20",
  },
  48: {
    description: "Depositing Rime Fog",
    iconName: "CloudFog",
    color: "text-teal-400",
    bgGradient: "from-slate-500 via-teal-300 to-slate-100",
    cardBg: "bg-teal-500/10 border-teal-500/20",
  },
  51: {
    description: "Light Drizzle",
    iconName: "CloudDrizzle",
    color: "text-blue-400",
    bgGradient: "from-blue-500 via-sky-300 to-slate-200",
    cardBg: "bg-blue-500/10 border-blue-500/20",
  },
  53: {
    description: "Moderate Drizzle",
    iconName: "CloudDrizzle",
    color: "text-blue-500",
    bgGradient: "from-blue-600 via-sky-400 to-slate-200",
    cardBg: "bg-blue-500/10 border-blue-500/20",
  },
  55: {
    description: "Dense Drizzle",
    iconName: "CloudDrizzle",
    color: "text-blue-600",
    bgGradient: "from-blue-700 via-sky-500 to-slate-300",
    cardBg: "bg-blue-600/10 border-blue-600/20",
  },
  56: {
    description: "Light Freezing Drizzle",
    iconName: "CloudSnow",
    color: "text-cyan-400",
    bgGradient: "from-cyan-600 via-blue-300 to-sky-100",
    cardBg: "bg-cyan-500/10 border-cyan-500/20",
  },
  57: {
    description: "Dense Freezing Drizzle",
    iconName: "CloudSnow",
    color: "text-cyan-600",
    bgGradient: "from-cyan-700 via-blue-400 to-slate-200",
    cardBg: "bg-cyan-600/10 border-cyan-600/20",
  },
  61: {
    description: "Slight Rain",
    iconName: "CloudRain",
    color: "text-blue-500",
    bgGradient: "from-blue-600 via-sky-400 to-slate-200",
    cardBg: "bg-blue-500/10 border-blue-500/20",
  },
  63: {
    description: "Moderate Rain",
    iconName: "CloudRain",
    color: "text-blue-600",
    bgGradient: "from-blue-700 via-indigo-400 to-slate-300",
    cardBg: "bg-blue-600/10 border-blue-600/20",
  },
  65: {
    description: "Heavy Rain",
    iconName: "CloudRainWind",
    color: "text-blue-700",
    bgGradient: "from-blue-800 via-indigo-600 to-slate-400",
    cardBg: "bg-blue-700/10 border-blue-700/20",
  },
  66: {
    description: "Light Freezing Rain",
    iconName: "CloudHail",
    color: "text-teal-500",
    bgGradient: "from-teal-600 via-sky-400 to-slate-200",
    cardBg: "bg-teal-500/10 border-teal-500/20",
  },
  67: {
    description: "Heavy Freezing Rain",
    iconName: "CloudHail",
    color: "text-teal-700",
    bgGradient: "from-teal-800 via-indigo-500 to-slate-300",
    cardBg: "bg-teal-700/10 border-teal-700/20",
  },
  71: {
    description: "Slight Snow",
    iconName: "Snowflake",
    color: "text-indigo-400",
    bgGradient: "from-indigo-400 via-sky-200 to-blue-50",
    cardBg: "bg-indigo-400/10 border-indigo-400/20",
  },
  73: {
    description: "Moderate Snow",
    iconName: "Snowflake",
    color: "text-indigo-500",
    bgGradient: "from-indigo-500 via-sky-300 to-blue-100",
    cardBg: "bg-indigo-500/10 border-indigo-500/20",
  },
  75: {
    description: "Heavy Snow",
    iconName: "Snowflake",
    color: "text-indigo-600",
    bgGradient: "from-indigo-700 via-blue-400 to-sky-200",
    cardBg: "bg-indigo-600/10 border-indigo-600/20",
  },
  77: {
    description: "Snow Grains",
    iconName: "Snowflake",
    color: "text-sky-300",
    bgGradient: "from-indigo-300 via-sky-200 to-white",
    cardBg: "bg-sky-300/10 border-sky-300/20",
  },
  80: {
    description: "Slight Rain Showers",
    iconName: "CloudSunRain",
    color: "text-blue-500",
    bgGradient: "from-blue-500 via-sky-300 to-amber-100",
    cardBg: "bg-blue-500/10 border-blue-500/20",
  },
  81: {
    description: "Moderate Rain Showers",
    iconName: "CloudRain",
    color: "text-blue-600",
    bgGradient: "from-blue-600 via-indigo-400 to-sky-200",
    cardBg: "bg-blue-600/10 border-blue-600/20",
  },
  82: {
    description: "Violent Rain Showers",
    iconName: "CloudRainWind",
    color: "text-indigo-700",
    bgGradient: "from-indigo-800 via-blue-600 to-slate-400",
    cardBg: "bg-indigo-700/10 border-indigo-700/20",
  },
  85: {
    description: "Slight Snow Showers",
    iconName: "CloudSnow",
    color: "text-sky-400",
    bgGradient: "from-indigo-400 via-sky-200 to-slate-100",
    cardBg: "bg-sky-400/10 border-sky-400/20",
  },
  86: {
    description: "Heavy Snow Showers",
    iconName: "CloudSnow",
    color: "text-sky-600",
    bgGradient: "from-indigo-600 via-blue-400 to-slate-200",
    cardBg: "bg-sky-600/10 border-sky-600/20",
  },
  95: {
    description: "Thunderstorm",
    iconName: "CloudLightning",
    color: "text-amber-500",
    bgGradient: "from-slate-900 via-indigo-950 to-slate-800",
    cardBg: "bg-amber-500/10 border-amber-500/20",
  },
  96: {
    description: "Thunderstorm with Hail",
    iconName: "CloudLightning",
    color: "text-purple-500",
    bgGradient: "from-slate-900 via-purple-950 to-slate-800",
    cardBg: "bg-purple-500/10 border-purple-500/20",
  },
  99: {
    description: "Severe Thunderstorm & Hail",
    iconName: "CloudLightning",
    color: "text-red-500",
    bgGradient: "from-zinc-950 via-red-950 to-slate-900",
    cardBg: "bg-red-500/10 border-red-500/20",
  },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return (
    WMO_CODES[code] || {
      description: "Unknown Weather",
      iconName: "Cloud",
      color: "text-slate-500",
      bgGradient: "from-sky-400 via-slate-200 to-sky-100",
      cardBg: "bg-slate-500/10 border-slate-500/20",
    }
  );
}

// Convert wind direction degrees to cardinal direction (N, NE, E, SE, S, SW, W, NW)
export function getWindDirectionText(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// UV Index category helper
export function getUvCategory(uv: number): { label: string; color: string; badge: string } {
  if (uv <= 2) return { label: "Low", color: "text-emerald-600", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" };
  if (uv <= 5) return { label: "Moderate", color: "text-amber-600", badge: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
  if (uv <= 7) return { label: "High", color: "text-orange-600", badge: "bg-orange-500/10 text-orange-600 border-orange-500/30" };
  if (uv <= 10) return { label: "Very High", color: "text-red-600", badge: "bg-red-500/10 text-red-600 border-red-500/30" };
  return { label: "Extreme", color: "text-purple-600", badge: "bg-purple-500/10 text-purple-600 border-purple-500/30" };
}
