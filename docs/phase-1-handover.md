# Phase 1 — Handover summary

Verified against the repository (structure, entry points, and source). Focus: how the repo is organized and how to work in it — not deep product feature docs.

## What this repo is

A financial metrics dashboard for local/demo use: React + TypeScript UI and a FastAPI mock API, run together with Docker Compose.

## Key folders and entry points

| Path | Role |
|------|------|
| `frontend/` | Next.js + React app; App Router entry `src/app/page.tsx`, client UI `src/App.tsx` |
| `frontend/src/components/dashboard/` | KPI row + charts |
| `frontend/src/lib/` | Types, aggregation utils, unused static `mock-data.ts` |
| `backend/app/main.py` | FastAPI app + CORS |
| `backend/app/routes.py` | Domain models, mock generator, all API routes |
| `backend/tests/` | pytest + TestClient |
| `docker-compose.yml` | `frontend` (:5173) + `backend` (:8000, debugpy :5678) |
| `AGENTS.md` | Points agents at `.agents/rules`, `.agents/skills`, `memory-bank` |

## How services connect

- Local run: `docker compose up --build`
- Frontend calls `/api/...`; Next.js rewrites `/api` → `http://backend:8000` (`frontend/next.config.ts`)
- Optional overrides: `BACKEND_URL` or `NEXT_PUBLIC_API_BASE_URL` (see `frontend/.env.example`)
- Backend data is in-memory mock movements from `generate_mock_movements(seed=42)` — no database

## API surface (backend)

- `GET /health`
- `GET /api/metrics` (+ date/category/operation filters)
- `GET /api/metrics/facets|summary|categories/top|comparison|alerts`
- `GET /api/metrics/b2b` and `/api/metrics/b2c`

## What the UI actually uses today

`App.tsx` fetches only `GET /api/metrics`, then computes KPIs and monthly series in `financial-utils.ts`. Richer backend endpoints exist but are unused by the frontend.

## Corrections vs a naive AI summary

| Claim to avoid | Evidence |
|----------------|----------|
| “Fixed 2024 fiscal year dataset” | Mock dates are relative to `date.today()` in `routes.py`; header text hard-codes `"2024 - Full Year"` in `App.tsx` |
| “UI uses the full metrics API” | Only `/api/metrics` is fetched |
| “Has a real database” | Seeded mock list only |
| “`mock-data.ts` powers the dashboard” | File exists under `src/lib/` but is not imported by `App.tsx` |

## Agent context (expected, not yet committed in this phase)

`AGENTS.md` expects `.agents/rules`, optional `.agents/skills`, and `memory-bank`. Those artifacts belong in later phases.
