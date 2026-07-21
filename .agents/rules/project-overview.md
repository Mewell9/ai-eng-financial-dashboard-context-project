# Project overview

**Scope:** Whole-repo defaults for agents.  
**Rationale:** Prevent inventing infra and keep local workflow Compose-first.

## Run
`docker compose up --build` → UI `:5173`, API `:8000`, docs `:8000/docs`.

## Constraints
- Call API via `/api` (Next.js rewrite). Optional: `NEXT_PUBLIC_API_BASE_URL`.
- Backend is seeded mock data (`seed=42`), not a DB.
- Do not add auth/persistence unless requested.
- Prefer small changes that match existing patterns.

## Validation
Guides tasks like “start the stack” or “wire a new UI call” without proposing a database.
