# Frontend

**Scope:** `frontend/src/` (Next.js App Router, dashboard components, `lib/`).
**Rationale:** Keep UI presentational; keep KPI/chart math testable.

## Conventions
- `app/` owns the Next.js shell and metadata; `App.tsx` owns client fetch + loading/error.
- Types: `lib/financial-types.ts`. Math: `lib/financial-utils.ts`.
- Prefer live `/api` over unused `lib/mock-data.ts`.
- Dark theme default; Card/Skeleton for loading.
- Preserve Spanish error copy in `App.tsx` unless i18n is requested.
- Today the UI only uses `GET /api/metrics` and aggregates client-side; use richer endpoints only when the task needs them.

## Validation
Guides “add a KPI or chart” to update utils (+ Vitest) then presentational components — not to invent a parallel mock source.
