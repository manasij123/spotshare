# SpotShare

Share a place temporarily — pick a location, choose how long you'll be there,
and send a short-lived link. Not GPS spoofing: the recipient sees the place
you chose, a live countdown, and directions, and the link expires on its own.

## Structure

- `client/` — React + TypeScript + Vite + Tailwind + Leaflet frontend
- `server/` — Express + TypeScript + Prisma/PostgreSQL backend
- `render.yaml` — Render Blueprint (API + free Postgres)
- `DEPLOY.md` — step-by-step free-tier deployment guide (Render + Vercel)

See `client/README.md` and `server/README.md` for local dev setup.
