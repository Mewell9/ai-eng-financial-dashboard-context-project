# Product overview

Evidence-based product snapshot for agents (not a marketing brief).

## Product
Financial Metrics Dashboard: executive view of income/outcome movements with KPI cards and monthly charts.

## Users / context
Local demo / learning project (4Geeks). No auth. Data is synthetic.

## Core entity
`FinancialMovement` — dated amount with `operation_type`, `category`, `business_type`.

## Implemented experience
- Dashboard header + 4 KPIs (income, outcome, profit, margin)
- Income vs outcome chart and profit-% chart
- Backend mock API with filters, summary, facets, comparison, alerts, B2B/B2C

## Out of scope (by design)
Real ledger DB, authentication, production hardening, payment integrations.
