# Backend

**Scope:** `backend/app/` and `backend/tests/`.  
**Rationale:** Keep mock API changes consistent, typed, and tested.

## Conventions
- Domain literals and helpers live in `routes.py`.
- Mock: `generate_mock_movements(seed=42)` (30 × 12 months).
- New endpoints: Pydantic response model + Query params + pytest in `tests/test_routes.py`.
- Keep CORS open and debugpy on `:5678` unless asked to change ops.

## Endpoints
`/health`, `/api/metrics`, `/facets`, `/summary`, `/categories/top`, `/comparison`, `/alerts`, `/b2b`, `/b2c`

## Validation
Guides “add a filtered metrics route” toward `routes.py` helpers + a TestClient test, not a new service layer.
