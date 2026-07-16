# Tech stack

## Frontend
- React 19 + TypeScript + Vite 8
- Tailwind CSS 4, Recharts, lucide-react, shadcn-style UI under `components/ui`
- Vitest for unit tests (`frontend/package.json` scripts)

## Backend
- Python 3.13 (Docker image), FastAPI, Uvicorn
- Pydantic models in `backend/app/routes.py`
- pytest + httpx/TestClient; debugpy on `:5678`

## Infra / tooling
- Docker Compose: `frontend` (:5173), `backend` (:8000)
- Vite proxy `/api` → `http://backend:8000`
- Optional `VITE_API_BASE_URL` (`frontend/.env.example`)
- Agent pointers: `AGENTS.md` → `.agents/rules`, `.agents/skills`, `memory-bank`
