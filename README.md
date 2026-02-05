# LockedIn

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
uv run uvicorn main:app --reload
```

API runs at **http://localhost:8000**. Docs: http://localhost:8000/docs

### 2. Frontend (Next.js)

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**.

Open http://localhost:3000 — the page will call the Python API and show the welcome message and sample items.

## Project layout

- `backend/` — FastAPI app (`main.py`), CORS enabled for `localhost:3000`
- `frontend/` — Next.js 15 (App Router), fetches from `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`)

## Optional env

- **Frontend:** copy `frontend/.env.local.example` to `frontend/.env.local` and set `NEXT_PUBLIC_API_URL` if the backend is not on port 8000.
