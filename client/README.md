# SpotShare Client

React + TypeScript + Vite + Tailwind frontend for SpotShare — create a temporary shareable link for a meeting place or pickup point.

## Setup

```bash
npm install
npm run dev   # http://localhost:5173, proxies /api to http://localhost:4000
```

The dev server proxies `/api/*` to the backend (see `vite.config.ts`), so run the `server` app alongside it. For a production build served from a different origin than the API, set `VITE_API_BASE_URL` (see `.env.example`).

## Routes

- `/` — creator dashboard: search a place, pick a duration, add an optional note, generate a share link.
- `/share/:shareId` — public recipient page: map, place info, live countdown, directions, and the expired state once the link lapses.
- `/expired` — generic expired/not-found page.

## Map

Uses [react-leaflet](https://react-leaflet.js.org/) with OpenStreetMap raster tiles — no map API key required. The blue marker + translucent circle represent the *shared place*, not device GPS accuracy.
