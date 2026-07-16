# API contract

**Scope:** Shared FE/BE domain shape for financial movements and filters.  
**Rationale:** Stop type drift and false assumptions about date ranges.

## FinancialMovement
`create_date` (ISO date) · `amount` · `operation_type` (`income`|`outcome`) · `category` (`suppliers`|`sales`|`operational`|`administrative`|`others`) · `business_type` (`B2B`|`B2C`)

## Rules
- Keep `financial-types.ts` and backend Pydantic literals aligned.
- Mock dates roll with `date.today()` — do not hard-code calendar years in UI labels when wiring live data.
- Common filters: `start_date`, `end_date`, `category`, `operation_type` (+ `business_type` / `group_by` on some routes).

## Validation
Guides “add B2B filter” to reuse existing query params/types instead of inventing new enums or a fixed-2024 dataset.
