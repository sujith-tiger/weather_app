# Weather Intelligence App

A modern, high-precision Weather Intelligence & AI Planning dashboard built with React, Vite, Tailwind CSS, Recharts, and Open-Meteo API. Powered by serverless API handlers and Gemini AI for personalized activity and outfit recommendations based on live meteorological data.

---

## Features

- **Live Meteorological Data**: Real-time temperature, humidity, wind conditions, UV index, cloud cover, atmospheric pressure, and precipitation.
- **24-Hour Interactive Forecast**: Multi-metric charts (temperature, rain probability, wind speed, humidity) powered by Recharts.
- **7-Day Extended Forecast**: Daily min/max temperature range bars, precipitation probability, and detailed expandable metric drawers.
- **AI Planning & Recommendations**: AI-synthesized weather summaries, optimal activity windows, top/bottom layer outfit suggestions, and outdoor activity suitability index.
- **Global Geocoding & City Search**: Instant search for any city worldwide with quick-select popular hubs (Tokyo, London, New York, Paris, Sydney).
- **Favorites & Location Management**: Bookmark favorite cities with client-side local persistence.
- **Resilient Fallback Architecture**: Client gracefully falls back directly to public Open-Meteo APIs if backend proxies are unavailable in static deployments.

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+ or Bun
- npm, pnpm, or bun package manager

### Installation & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` (optional, for Gemini AI features):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## AI Studio & GitHub Sync

### Exporting from AI Studio to GitHub

1. In **Google AI Studio Build**, click the **Settings / Export** menu in the top right.
2. Select **Export to GitHub** or download as a **ZIP repository**.
3. Push your repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from AI Studio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/weather-intelligence.git
   git push -u origin main
   ```

---

## Deployment to Cloudflare

This repository is pre-configured for deployment to **Cloudflare Workers / Pages** using Wrangler.

### Option A: Deployment via Cloudflare CLI (Wrangler)

1. **Install Wrangler CLI globally (if not already installed):**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare:**
   ```bash
   npx wrangler login
   ```

3. **Build the production assets:**
   ```bash
   npm run build
   ```

4. **Deploy to Cloudflare:**
   ```bash
   npx wrangler deploy
   ```

> **Note on `wrangler.json` Configuration:**  
> The included `wrangler.json` sets `main: "src/worker.ts"` as the worker entry-point and binds `./dist` static assets:
> ```json
> {
>   "name": "weather-intelligence",
>   "compatibility_date": "2026-07-31",
>   "main": "src/worker.ts",
>   "assets": {
>     "directory": "./dist",
>     "binding": "ASSETS"
>   }
> }
> ```

---

### Option B: Deployment via Cloudflare Pages (Git Integration)

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository (`weather-intelligence`).
4. Set the Build Configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. (Optional) Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *Your Google Gemini API Key*
6. Click **Save and Deploy**.

---

## Project Structure

```
├── public/                 # Static public assets
├── src/
│   ├── components/         # Modular UI cards and drawers
│   │   ├── AIPlanningCard.tsx
│   │   ├── CitySearch.tsx
│   │   ├── CurrentWeatherCard.tsx
│   │   ├── DailyForecastCard.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── Navbar.tsx
│   │   └── SavedLocationsDrawer.tsx
│   ├── utils/              # Weather code helpers and utilities
│   ├── App.tsx             # Main application orchestrator
│   ├── index.css           # Global Tailwind CSS and glassmorphism styles
│   ├── main.tsx            # React application entry point
│   ├── types.ts            # TypeScript definitions
│   └── worker.ts           # Cloudflare Worker API proxy entry point
├── server.ts               # Local Express development server
├── wrangler.json           # Cloudflare deployment configuration
├── vite.config.ts          # Vite build configuration
└── README.md
```

---

## License

MIT License. Built with Google AI Studio.
