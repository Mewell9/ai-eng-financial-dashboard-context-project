# Component specifications

Component breakdown for the three features. This is a **specification**, not an
implementation — no React code. Each component lists its props (with types from
`api-types.ts` / `param-types.ts`), the data it needs, and its conditional
rendering rules. A developer or agent should be able to build each feature from
this document alone.

Types referenced below live in:
- `./api-types.ts` — `FacetsResponse`, `AlertEntry`, `AlertsResponse`, `CategoryEntry`, `TopCategoriesResponse`
- `./param-types.ts` — `DateRangeFilter`, `AlertsParams`, `TopCategoriesParams`

---

## Feature 1 — Date range filter (home dashboard)

### `DateRangeControls`
Two optional date inputs at the top of the dashboard that drive all data on the page.

| Prop | Type | Meaning |
|------|------|---------|
| `value` | `DateRangeFilter` | Current selected range (either field may be empty). |
| `availableRange` | `{ minDate: string; maxDate: string }` | From `FacetsResponse`; shown as reference text. |
| `onChange` | `(next: DateRangeFilter) => void` | Fired when either input changes. |

**Data needed:** `GET /api/metrics/facets` for `minDate`/`maxDate`.

**Conditional rendering:**
- Always render a reference hint, e.g. `Available: {minDate} → {maxDate}`.
- When both inputs are empty → controls show no active filter; the page shows all data.
- When only one input is set → show the range as open-ended on the empty side.
- If `startDate > endDate` (both set) → show an inline validation message and do **not** emit the invalid range.

### `DashboardDataProvider` (behavioral wrapper, not visual)
Owns the shared `DateRangeFilter` and passes it to every data widget (KPIs, charts, alerts table) so they all filter consistently via the metrics endpoints' date params.

---

## Feature 2 — Anomaly alerts table (home dashboard)

### `ThresholdInput`
Numeric input controlling spike sensitivity.

| Prop | Type | Meaning |
|------|------|---------|
| `value` | `number` | Current threshold. |
| `onChange` | `(next: number) => void` | Fired on change. |

**Rules:** min `0.01`, max `1.0`, step small (e.g. `0.01`), default `0.3`. Clamp out-of-range input to the nearest bound before emitting.

### `AnomalyAlertsTable`
Table beneath the existing charts highlighting periods where spending spiked.

| Prop | Type | Meaning |
|------|------|---------|
| `rows` | `AlertsResponse` | Alert entries to render. |
| `loading` | `boolean` | Whether the request is in flight. |

**Data needed:** `GET /api/metrics/alerts` with `AlertsParams` (`threshold` + active `DateRangeFilter`).

**Columns (in order):**
1. **Period** — `AlertEntry.period`
2. **Recorded outcome** — `AlertEntry.outcomeTotal` (currency)
3. **Baseline average** — `AlertEntry.baselineAverage` (currency). Label reflects the API's real meaning: *average of all prior periods* (see README note on the "previous 3 periods" divergence).
4. **Increase** — `AlertEntry.increaseRatio` rendered as a percentage (e.g. `0.42` → `+42%`).

**Conditional rendering:**
- `loading` → skeleton rows.
- `rows.length === 0` → an explicit empty-state message (e.g. *"No anomalies detected for the current threshold."*). The table container stays visible; it must **not** disappear.
- Otherwise → one row per entry, ordered as returned by the API.

---

## Feature 3 — B2B vs B2C comparison view (new page)

### `ComparisonPage`
Page container with two side-by-side panels plus a summary chart.

| Prop | Type | Meaning |
|------|------|---------|
| `dateRange` | `DateRangeFilter` | Optional range applied to both panels and the chart. |

**Data needed (per render):**
- `GET /api/metrics/facets` — authoritative category list per group.
- `GET /api/metrics/categories/top` twice: once with `businessType: "B2B"`, once with `"B2C"`, each using `operationType: "income"`, `limit: 5`, and the shared `DateRangeFilter`.

### `TopCategoriesPanel` (rendered twice)
| Prop | Type | Meaning |
|------|------|---------|
| `businessType` | `"B2B" \| "B2C"` | Which line this panel represents. |
| `rows` | `TopCategoriesResponse` | Top income categories for the group. |
| `loading` | `boolean` | Request in flight. |

**Columns:**
1. **Category** — `CategoryEntry.category`
2. **Total income** — `CategoryEntry.totalAmount` (currency)
3. **% of group total** — `CategoryEntry.totalAmount / sum(rows.totalAmount)` for that panel, rendered as a percentage.

**Conditional rendering:**
- `loading` → skeleton rows.
- `rows.length === 0` → explicit empty-state message (e.g. *"No income categories for B2B in this range."*). Panel stays visible.
- `% of group total` divides by the panel's own summed totals; if that sum is `0`, show `0%` (never divide by zero).

### `BusinessTotalsChart`
Single chart below both panels comparing total income of B2B vs B2C.

| Prop | Type | Meaning |
|------|------|---------|
| `b2bTotal` | `number` | Total income for B2B. |
| `b2cTotal` | `number` | Total income for B2C. |

**Total source (assumption, see README):** each group's total is the **sum of that group's returned top-5 `CategoryEntry.totalAmount`** values, since only `categories/top` + `facets` are in scope for this feature.

**Conditional rendering:**
- Both totals `0` → empty-state message instead of an empty chart.
- Otherwise → two comparable bars/segments, one per business line.
