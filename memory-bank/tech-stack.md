# Tech stack

## Frontend
- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS 4, Recharts, lucide-react, shadcn-style UI under `components/ui`
- Vitest for unit tests (`frontend/package.json` scripts)

## Backend
- Python 3.13 (Docker image), FastAPI, Uvicorn
- Pydantic models in `backend/app/routes.py`
- pytest + httpx/TestClient; debugpy on `:5678`

## Infra / tooling
- Docker Compose: `frontend` (:5173), `backend` (:8000)
- Next.js rewrite `/api` → `http://backend:8000`
- Optional `BACKEND_URL` / `NEXT_PUBLIC_API_BASE_URL` (`frontend/.env.example`)
- Agent pointers: `AGENTS.md` → `.agents/rules`, `.agents/skills`, `memory-bank`
