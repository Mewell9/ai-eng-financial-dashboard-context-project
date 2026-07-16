# Testing

**Scope:** Backend pytest and frontend Vitest.  
**Rationale:** Protect filters/contracts without brittle amount snapshots.

## Backend
pytest + TestClient in `backend/tests/`. Cover filters, sorting, and response shapes. Prefer seed-stable shape checks over exact amounts unless necessary.

## Frontend
Vitest in `frontend/` (`npm test`). Prefer testing `financial-utils` over full DOM unless UI behavior is the change.

## Validation
Guides “cover a new filter” to the correct test runner and assertion style for this repo.
