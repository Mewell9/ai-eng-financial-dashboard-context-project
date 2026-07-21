---
name: financial-dashboard-data-integrity
description: Preserves financial metric meaning, rolling date accuracy, and accessible chart equivalents. Use when changing dashboard KPIs, date periods, financial formatting, movement aggregation, or chart data.
disable-model-invocation: true
---

# Financial Dashboard Data Integrity

## Objective

Keep dashboard labels, calculations, and accessible output traceable to the `FinancialMovement` data returned by the API.

## Inputs

- The requested dashboard change.
- `frontend/src/lib/financial-types.ts` and the backend response model.
- Existing utilities and tests in `frontend/src/lib/financial-utils*`.
- Loading, empty, error, and zero-income behavior affected by the change.

## Workflow

1. Confirm frontend and backend literals remain aligned.
2. Put reusable financial calculations and formatting in `financial-utils.ts`.
3. Derive date labels from `create_date`; never hard-code a calendar year for rolling data.
4. Treat income and outcome amounts as positive magnitudes and calculate profit as income minus outcome.
5. Return a zero profit percentage when income is zero to avoid `NaN` or infinity.
6. Use shared currency and percentage formatters in visible and assistive-technology output.
7. Give every visual chart an equivalent text or table representation.
8. Add focused utility tests before presenting the result in a component.

## Expected output

- A small utility-level change with tests.
- A presentational component that consumes the utility result.
- Preserved loading, empty, and error states.
- No duplicate mock data source or new financial enum.

## Acceptance criteria

- Period labels match the earliest and latest movement dates.
- Cross-year and empty datasets have intentional labels.
- KPI and chart calculations remain finite for zero-income data.
- Visual and screen-reader values use the same source and formatters.
- `npm test`, `npm run lint`, and `npm run build` pass.
