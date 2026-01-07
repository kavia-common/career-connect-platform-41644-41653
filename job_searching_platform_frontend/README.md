# Talenvia — React Frontend (Job Searching Platform)

This container contains the Talenvia React frontend (Create React App), including routing, theming (Executive Gray), a working login flow, a protected dashboard, and placeholder modules for core product areas.

## Run locally

From `career-connect-platform-41644-41653/job_searching_platform_frontend/`:

```bash
npm install
npm start
```

Open http://localhost:3000

## Environment variables

The frontend uses CRA-style env vars (must be prefixed with `REACT_APP_`).

### Required

- `REACT_APP_API_BASE` — Base URL for backend REST calls (e.g. `http://localhost:8080`)
- `REACT_APP_SUPABASE_URL` — Supabase project URL (browser-exposed)
- `REACT_APP_SUPABASE_KEY` — Supabase anon/public key (browser-exposed)

### Supported fallbacks

- `REACT_APP_BACKEND_URL` — Used if `REACT_APP_API_BASE` is not set
- `SUPABASE_URL` — Used if `REACT_APP_SUPABASE_URL` is not set (legacy fallback)
- `SUPABASE_KEY` — Used if `REACT_APP_SUPABASE_KEY` is not set (legacy fallback)

Notes:
- CRA only exposes `REACT_APP_*` env vars to the browser bundle. Prefer the `REACT_APP_SUPABASE_*` names.
- The app will warn (in non-production) if Supabase env vars are missing/placeholder.

## Auth / Login flow

- Login page: `/login`
- Calls `POST ${REACT_APP_API_BASE}/auth/login`
- Stores:
  - `talenvia.accessToken` in `localStorage`
  - `talenvia.user` in `localStorage`
- Protected routes redirect unauthenticated users to `/login?returnTo=...`

## Project structure (high level)

- `src/app/` — app providers + shell layout
- `src/routes/` — route definitions + auth guard
- `src/pages/` — route-level pages (placeholders for key modules)
- `src/services/` — API client (env base URL, auth header injection, normalized errors)
- `src/state/` — auth + notifications lightweight stores
- `src/styles/` — Executive Gray theme + component primitives
=======
