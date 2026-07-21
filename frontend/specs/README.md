# Frontend specs — data contracts

Specification for three dashboard features. These docs define **what the UI
consumes**, not how it's built (no React, no fetch code). All shapes were
verified against the backend in `backend/app/routes.py`, which is what
`/docs` renders.

Files:
- `api-types.ts` — response interfaces
- `param-types.ts` — query-parameter types
- `components.md` — component breakdown per feature
- `tsconfig.json` — scoped config so `npx tsc --noEmit` type-checks this folder

Run the type check from `frontend/`:

```bash
npx tsc --noEmit -p specs/tsconfig.json
```

---

## Feature 1 — Date range filter

**Endpoint(s):**
- `GET /api/metrics/facets` → `FacetsResponse` (for the valid `min_date`/`max_date` reference).
- The existing metrics endpoints accept the same `start_date` / `end_date` params to filter displayed data.

**Types:** `FacetsResponse` (response), `DateRangeFilter` (params).

**Parameters & constraints:**
| Param | Type | Rules |
|-------|------|-------|
| `start_date` | `string?` | `YYYY-MM-DD`, optional, within `[min_date, max_date]`. |
| `end_date` | `string?` | `YYYY-MM-DD`, optional, within `[min_date, max_date]`. |

**Edge cases:**
1. **Both inputs empty** → send no date params; dashboard shows all available data. Reference hint still shows `min_date → max_date`.
2. **Only one input filled** → range is open-ended on the empty side (start-only = from date onward; end-only = up to date). The UI must not force the user to fill both.

---

## Feature 2 — Anomaly alerts table

**Endpoint:** `GET /api/metrics/alerts?threshold=<ratio>` → `AlertsResponse` (bare array).
Also accepts the active date range from Feature 1.

**Types:** `AlertEntry` / `AlertsResponse` (response), `AlertsParams` (params).

**Request/response:**
- Request params: `threshold` (0.01–1.0, default 0.3) + optional `start_date`/`end_date`.
- Response: array of `{ period, outcome_total, baseline_average, increase_ratio }`.

**Parameters & constraints:**
| Param | Type | Rules |
|-------|------|-------|
| `threshold` | `number` | UI: `0.01`–`1.0`, default `0.3`. API enforces only `>= 0`. |
| `start_date`/`end_date` | `string?` | `YYYY-MM-DD`, optional. |

**⚠️ Divergence from the product brief (intentional).**
The brief describes column 3 as the *"rolling average of the previous 3 periods."*
The API does **not** do this — `baseline_average` is the mean outcome of **all**
periods preceding the current one (an expanding/cumulative average), computed in
`detect_outcome_alerts` (`backend/app/routes.py`). Per the project rule that specs
must match what the API actually returns, `AlertEntry.baseline_average` is
documented and labeled as the *average of all prior periods*. We do not modify the
backend; the brief's wording is recorded here only for traceability.

**Edge cases:**
1. **No anomalies for the current threshold** → API returns `[]`; the table shows an explicit empty-state message and stays visible (it must not be hidden).
2. **Active date range** → the table re-queries with the same `start_date`/`end_date` as the dashboard, so it reflects only the selected window.

---

## Feature 3 — B2B vs B2C comparison view

**Endpoints:**
- `GET /api/metrics/categories/top?operation_type=income&limit=5` → `TopCategoriesResponse`, called once per business line (`business_type=B2B`, then `B2C`).
- `GET /api/metrics/facets` → `FacetsResponse` for the available categories per group.

**Types:** `CategoryEntry` / `TopCategoriesResponse` (response), `TopCategoriesParams` (params).

**Parameters & constraints:**
| Param | Type | Rules |
|-------|------|-------|
| `operation_type` | `"income" \| "outcome"` | Always `income` for this feature. |
| `limit` | `number` | Integer `1`–`20`; feature uses `5`. |
| `business_type` | `"B2B" \| "B2C"` | Required; selects the panel's group. |
| `start_date`/`end_date` | `string?` | `YYYY-MM-DD`, optional, shared by both panels. |

**Scope note (assumption).** Only `categories/top` + `facets` are in scope, so the
B2B-vs-B2C **total-income chart** uses the **sum of each group's returned top-5
`total_amount`** values as that group's total. `/api/metrics/comparison`
(`MetricsComparison`) is intentionally **out of scope** for this feature.

**Edge cases:**
1. **A group's top-5 list is empty** → API returns `[]` for that panel; the panel shows an explicit empty-state message and stays visible. The "% of group total" never divides by zero (show `0%` when the panel sum is `0`).
2. **Date range excludes all income** → both panels empty and both totals `0`; the chart shows an empty-state message instead of an empty plot.
