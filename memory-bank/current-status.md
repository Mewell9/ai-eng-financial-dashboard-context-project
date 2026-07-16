# Current status

## Implemented
- Compose-based FE/BE demo with hot reload
- Deterministic mock movements (`seed=42`)
- Dashboard KPIs + two charts from `GET /api/metrics`
- Backend analytics routes beyond what the UI uses
- Backend pytest suite; frontend utils Vitest coverage
- Agent rules under `.agents/rules/` (Phase 3)

## Known gaps
- UI does not use `/summary`, `/facets`, `/alerts`, `/comparison`, `/b2b`, `/b2c`
- Hard-coded header period `"2024 - Full Year"` vs rolling mock dates
- Unused `frontend/src/lib/mock-data.ts`
- Open CORS suitable for demo only
- No `.agents/skills` yet (optional)

## Next priorities
1. Wire filters/facets from existing backend endpoints
2. Derive period label from API date range (`/facets`)
3. Remove or clearly mark dead `mock-data.ts`
4. Add a skill only if a workflow repeats (e.g. “add metrics endpoint”)
