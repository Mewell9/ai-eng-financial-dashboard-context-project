# Phase 3 rules validation

Each rule was checked against a realistic repo task:

| Rule | Sample task | Expected agent behavior |
|------|-------------|-------------------------|
| `project-overview` | Run stack / call API from UI | Use Compose + `/api` proxy; no DB |
| `backend` | Add metrics filter endpoint | Edit `routes.py`, add pytest |
| `frontend` | Add derived KPI | Change utils + test, then UI |
| `api-contract` | Add B2B toggle | Reuse literals; avoid hard-coded year |
| `testing` | Cover new filter | pytest or Vitest in the right package |

Refinements applied: added **Scope** / **Rationale** to each rule; tightened guidance around unused `mock-data.ts`, rolling dates, and “only use richer endpoints when the task needs them.”
