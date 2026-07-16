# Phase 2 — Engineering practices analysis

Findings from reviewing `frontend/`, `backend/`, Compose, and tests. Grouped by category. Focus: maintainability and agent-safe workflow — not product feature depth.

## Good practices (≥5)

| # | Category | Practice | Evidence |
|---|----------|----------|----------|
| 1 | Architecture | Clear FE/BE split with Compose orchestration | `frontend/`, `backend/`, `docker-compose.yml` |
| 2 | Architecture | Deterministic mock API (`seed=42`) — no DB needed for local work | `generate_mock_movements` in `backend/app/routes.py` |
| 3 | DX | Vite `/api` proxy keeps local/Codespaces setup simple | `frontend/vite.config.ts`, README |
| 4 | Testing | Backend route coverage with TestClient; frontend utils covered by Vitest | `backend/tests/test_routes.py`, `financial-utils.test.ts` |
| 5 | Naming / contracts | Shared domain vocabulary (operation/category/business types) on both sides | `financial-types.ts` ↔ Pydantic literals in `routes.py` |
| 6 | Architecture | Pure aggregation helpers kept out of presentational components | `financial-utils.ts` + dashboard components |

## Bad / risky practices (≥5)

| # | Category | Risk | Evidence |
|---|----------|------|----------|
| 1 | Architecture | Frontend ignores richer backend analytics endpoints → duplicated logic and drift risk | UI only calls `/api/metrics` in `App.tsx` |
| 2 | Documentation / DX | Hard-coded period label does not match rolling mock dates | `App.tsx` / `dashboard-header.tsx` vs `date.today()` in `routes.py` |
| 3 | DX | Dead static dataset invites agents to “fix” the wrong data source | `frontend/src/lib/mock-data.ts` unused |
| 4 | Security / ops | Wide-open CORS (`allow_origins=["*"]`) with credentials enabled — fine for demo, unsafe if copied to prod | `backend/app/main.py` |
| 5 | Testing | Regenerating mock data inside every request path makes tests/endpoints recompute the full year repeatedly | each route calls `generate_mock_movements(seed=42)` |
| 6 | Documentation | Agent context dirs referenced by `AGENTS.md` were empty before this project work | `.agents/rules`, `memory-bank` |

## Proposed rule set (for Phase 3)

1. **project-overview** — Compose-first run; mock API only; no inventing DB/auth.
2. **backend** — Keep literals/helpers in `routes.py`; add Pydantic + pytest for new endpoints; preserve debugpy.
3. **frontend** — Keep math in utils; fetch via relative `/api`; prefer live API over `mock-data.ts`.
4. **api-contract** — Keep FE/BE domain types aligned; treat mock dates as rolling, not a fixed calendar year.
5. **testing** — pytest for routes; Vitest for pure utils; seed-stable assertions.

These map 1:1 to files under `.agents/rules/` in Phase 3.
