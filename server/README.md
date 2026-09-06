# SpotShare API

Express + TypeScript + Prisma/PostgreSQL backend for SpotShare.

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, etc.
npx prisma migrate dev --name init
npm run dev             # http://localhost:4000
```

## Endpoints

- `POST /api/locations/search` — proxies OpenStreetMap Nominatim geocoding (`{ query }` → `{ results: PlaceResult[] }`).
- `POST /api/shares` — creates a share (`{ placeName, address, latitude, longitude, durationMinutes, note? }` → `{ shareId, shareUrl, expiresAt }`).
- `GET /api/shares/:shareId` — returns the public share if active; `404` if unknown, `410` if expired/revoked.
- `GET /api/health` — liveness check.

## Notes

- Geocoding uses Nominatim, which requires no API key but does require a descriptive `User-Agent` (set via `NOMINATIM_USER_AGENT`) and reasonable request rates — both enforced server-side so the frontend never talks to a third-party API directly.
- `expiresAt` is always computed server-side from `durationMinutes`; never trust a client-supplied expiry.
- Share tokens are generated with `crypto.randomBytes` (see `src/lib/token.ts`) and are unrelated to the internal database id, which is never exposed publicly.
- Run `npm run typecheck` / `npm run build` before deploying.
