import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or safely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Proxy route for Geocoding API (Open-Meteo)
app.get("/api/geocoding", async (req, res) => {
  try {
    const name = req.query.name as string;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Missing required 'name' query parameter" });
    }
    const count = req.query.count || "10";
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      name
    )}&count=${count}&language=en&format=json`;

    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      throw new Error(`Open-Meteo Geocoding returned HTTP ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Geocoding Error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch geocoding data" });
  }
});

// Proxy route for Open-Meteo Forecast API
app.get("/api/forecast", async (req, res) => {
  try {
    const { latitude, longitude, temperature_unit, wind_speed_unit, precipitation_unit } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const tempUnit = temperature_unit === "fahrenheit" ? "fahrenheit" : "celsius";
    const windUnit = wind_speed_unit === "mph" ? "mph" : wind_speed_unit === "kn" ? "kn" : "kmh";
    const precipUnit = precipitation_unit === "inch" ? "inch" : "mm";

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
      "wind_gusts_10m"
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
      "wind_direction_10m_dominant"
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
      "uv_index"
    ].join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&daily=${dailyParams}&hourly=${hourlyParams}&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo Forecast returned HTTP ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Forecast Error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch forecast data" });
  }
});

// Gemini AI Weather Intelligence Insights
app.post("/api/ai-insights", async (req, res) => {
  try {
    const { locationName, country, current, daily, unit } = req.body;
    if (!locationName || !current) {
      return res.status(400).json({ error: "Missing required weather context" });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not set
      return res.json({
        summary: `Current conditions in ${locationName}: ${current.temperature}°${unit === "fahrenheit" ? "F" : "C"}.`,
        bestWindow: "10:00 AM - 4:00 PM for outdoors",
        outfit: {
          top: current.temperature < 15 ? "Layered sweater or jacket" : "Light t-shirt or shirt",
          bottom: "Comfortable pants or shorts",
          footwear: current.precipitation > 0 ? "Waterproof shoes" : "Comfortable sneakers",
          accessories: current.uv > 5 ? "Sunglasses & sunscreen" : current.precipitation > 0 ? "Umbrella" : "Hat or sunglasses"
        },
        activities: [
          { name: "Running / Jogging", rating: "Great", tip: "Good conditions for outdoor run" },
          { name: "Cycling", rating: "Good", tip: "Watch wind conditions" },
          { name: "Outdoor Dining", rating: "Moderate", tip: "Check hourly rain probability" },
          { name: "Photography", rating: "Excellent", tip: "Great lighting for outdoors" }
        ],
        planningTips: [
          "Keep an eye on humidity levels throughout the day.",
          "Check UV index before heading out in midday."
        ],
        smartAlert: null
      });
    }

    const prompt = `You are an expert meteorological advisor and lifestyle assistant for Weather Intelligence.
Analyze this weather data for ${locationName}, ${country || ""}:

- Temperature: ${current.temperature}°${unit === "fahrenheit" ? "F" : "C"} (Feels like ${current.apparentTemperature}°${unit === "fahrenheit" ? "F" : "C"})
- Condition: ${current.weatherDescription}
- Humidity: ${current.humidity}%
- Wind Speed: ${current.windSpeed} ${unit === "fahrenheit" ? "mph" : "km/h"}
- Precipitation Chance: ${current.precipitationProbability || 0}%
- UV Index: ${current.uvIndex || "N/A"}
- Cloud Cover: ${current.cloudCover}%
- Today High/Low: ${daily?.tempMax || "N/A"}° / ${daily?.tempMin || "N/A"}°

Provide actionable, stylish, and intelligent planning recommendations in strict JSON according to the schema provided.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A concise 1-2 sentence atmospheric summary and vibe."
            },
            bestWindow: {
              type: Type.STRING,
              description: "Optimal time window today for outdoor activities."
            },
            outfit: {
              type: Type.OBJECT,
              properties: {
                top: { type: Type.STRING, description: "Recommended upper body clothing" },
                bottom: { type: Type.STRING, description: "Recommended lower body clothing" },
                footwear: { type: Type.STRING, description: "Recommended shoes" },
                accessories: { type: Type.STRING, description: "Must-have accessories (umbrella, sunglasses, etc.)" }
              },
              required: ["top", "bottom", "footwear", "accessories"]
            },
            activities: {
              type: Type.ARRAY,
              description: "List of 4 activities with suitability rating and short tip.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.STRING, description: "Optimal, Great, Moderate, or Poor" },
                  tip: { type: Type.STRING }
                },
                required: ["name", "rating", "tip"]
              }
            },
            planningTips: {
              type: Type.ARRAY,
              description: "2-3 practical travel or commute planning recommendations.",
              items: { type: Type.STRING }
            },
            smartAlert: {
              type: Type.STRING,
              description: "Optional warning if severe weather, high UV, heavy rain, extreme temperature, or zero if normal."
            }
          },
          required: ["summary", "bestWindow", "outfit", "activities", "planningTips"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("AI Insights Error:", error);
    return res.status(500).json({
      error: "Failed to generate AI insights",
      details: error.message
    });
  }
});

async function startServer() {
  // Setup Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Weather Intelligence server listening on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
