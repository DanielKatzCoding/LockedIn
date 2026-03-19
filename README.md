# LockedIn
This platform will allow us to update our job hunt progress on a dashboard 


Full-stack app: **Next.js** (frontend) + **Python/FastAPI** (backend).

## Prerequisites

- Node.js 18+
- Python 3.10+
- [uv](https://docs.astral.sh/uv/) (recommended for the backend)

## Run the app

### 1. Backend (Python with uv)

```bash
cd backend
uv sync
uv run uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

API runs at **http://localhost:8000**. 
Swagger: http://localhost:8000/docs

### 2. Frontend (Next.js)

In a new terminal:

```bash
cd frontend
pnpm i
pnpm run dev
```

App runs at **http://localhost:3000**.

Open http://localhost:3000 — the page will call the Python API and show the welcome message and sample items.

## Project layout

- `backend/` — FastAPI app (`main.py`), CORS enabled.
- `frontend/` — Next.js 15 (App Router), fetches from `BASE_API_URL` (default `http://localhost:8000/api`)
- **Database:** Uses a named Docker volume `postgres_data` to persist data across restarts.

## Running with Docker Compose

```bash
docker-compose up -d   # start backend, frontend, and Postgres
docker-compose down    # stop services (data persists thanks to the named volume)
```
