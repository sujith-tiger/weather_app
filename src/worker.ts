interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health Check
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Geocoding Proxy
    if (url.pathname === "/api/geocoding") {
      try {
        const name = url.searchParams.get("name");
        if (!name) {
          return new Response(JSON.stringify({ error: "Missing required 'name' query parameter" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const count = url.searchParams.get("count") || "10";
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          name
        )}&count=${count}&language=en&format=json`;

        const response = await fetch(geocodeUrl);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Failed to fetch geocoding data" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Forecast Proxy
    if (url.pathname === "/api/forecast") {
      try {
        const latitude = url.searchParams.get("latitude");
        const longitude = url.searchParams.get("longitude");
        const tempUnitParam = url.searchParams.get("temperature_unit");
        const windUnitParam = url.searchParams.get("wind_speed_unit");
        const precipUnitParam = url.searchParams.get("precipitation_unit");

        if (!latitude || !longitude) {
          return new Response(JSON.stringify({ error: "Latitude and Longitude are required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const tempUnit = tempUnitParam === "fahrenheit" ? "fahrenheit" : "celsius";
        const windUnit = windUnitParam === "mph" ? "mph" : windUnitParam === "kn" ? "kn" : "kmh";
        const precipUnit = precipUnitParam === "inch" ? "inch" : "mm";

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

        const targetUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&daily=${dailyParams}&hourly=${hourlyParams}&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto`;

        const response = await fetch(targetUrl);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Failed to fetch forecast data" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // AI Insights Proxy
    if (url.pathname === "/api/ai-insights" && request.method === "POST") {
      try {
        const body: any = await request.json();
        const { locationName, current, daily, unit } = body || {};
        if (!locationName || !current) {
          return new Response(JSON.stringify({ error: "Missing required weather context" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const fallbackInsights = {
          summary: `Current conditions in ${locationName}: ${current.temperature}°${unit === "fahrenheit" ? "F" : "C"}. ${current.weatherDescription || ""}`,
          bestWindow: "10:00 AM - 4:00 PM for outdoors",
          outfit: {
            top: current.temperature < 15 ? "Layered sweater or jacket" : "Light t-shirt or shirt",
            bottom: "Comfortable pants or shorts",
            footwear: current.precipitation > 0 ? "Waterproof shoes" : "Comfortable sneakers",
            accessories: current.uvIndex > 5 ? "Sunglasses & sunscreen" : current.precipitation > 0 ? "Umbrella" : "Hat or sunglasses",
          },
          activities: [
            { name: "Running / Jogging", rating: "Great", tip: "Good conditions for outdoor run" },
            { name: "Cycling", rating: "Good", tip: "Watch wind conditions" },
            { name: "Outdoor Dining", rating: "Moderate", tip: "Check hourly rain probability" },
            { name: "Photography", rating: "Excellent", tip: "Great lighting for outdoors" },
          ],
          planningTips: [
            "Keep an eye on humidity levels throughout the day.",
            "Check UV index before heading out in midday.",
          ],
          smartAlert: current.precipitation > 5 ? "Rain predicted, take an umbrella." : null,
        };

        return new Response(JSON.stringify(fallbackInsights), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: "Failed to generate AI insights" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Fallback to static asset serving
    return env.ASSETS.fetch(request);
  },
};
