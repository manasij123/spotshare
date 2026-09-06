# Deploying SpotShare (free hosting, mobile-friendly)

This deploys the backend (API + Postgres) to **Render** and the frontend to
**Vercel**, entirely from a browser — no computer or CLI needed.

## 1. Deploy the backend + database on Render

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** → **Blueprint**.
3. Pick the `manasij123/spotshare` repo (branch: `main`).
4. Render detects `render.yaml` at the repo root — it defines a web service
   (`spotshare-backend`) and a free Postgres database (`spotshare-postgres`). Click
   **Apply**.
5. Wait for the build to finish, then open the `spotshare-backend` service and
   copy its URL from the top of the page — something like
   `https://spotshare-backend.onrender.com`. You'll need it in step 2.

Notes: the free web service spins down after ~15 minutes of no traffic (the
first request after that takes ~30s to wake it up), and the free Postgres
database expires after 30 days — both are fine for previewing, but not for
a permanent deployment.

## 2. Deploy the frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project**, import the `manasij123/spotshare` repo.
3. Under **Root Directory**, select `client` (Vercel should auto-detect the
   Vite framework once you do).
4. Add an environment variable:
   - `VITE_API_BASE_URL` = the Render URL from step 1 (no trailing slash),
     e.g. `https://spotshare-backend.onrender.com`
5. Click **Deploy**. When it finishes, open the project and copy its URL,
   e.g. `https://spotshare.vercel.app`.

## 3. Point the backend at the frontend

Share links and CORS need to know the frontend's real URL:

1. Back on Render, open the `spotshare-backend` service → **Environment**.
2. Set:
   - `CLIENT_ORIGIN` = your Vercel URL (e.g. `https://spotshare.vercel.app`)
   - `PUBLIC_APP_URL` = the same Vercel URL
3. Save — Render redeploys the service automatically.

## 4. Try it

Open your Vercel URL on your phone. Search a place, pick a duration, create
a share link, then open the generated `/share/...` link — it should load
directly (the SPA rewrite in `client/vercel.json` handles that).

## Later: a real domain / persistent database

- Swap the free Postgres for a permanent one (e.g. [neon.tech](https://neon.tech)
  free tier) by changing `DATABASE_URL` on Render.
- Both Render and Vercel support attaching a custom domain for free.
