import sys
from pathlib import Path
# Ensure the project root (parent of the backend package) and the backend package itself are on sys.path
# This must run BEFORE any project imports.
sys.path.append(str(Path(__file__).resolve().parents[1]))  # project root
sys.path.append(str(Path(__file__).parent))               # backend package

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Use relative imports now that the package is on the path
from backend.api.applications import router as applications_router
from backend.services.database_service import db_service

# ---------------------------------------------------------------------------
# FastAPI application instance with a lifespan function
# ---------------------------------------------------------------------------

async def lifespan(app: FastAPI):
    """Runs once at startup and once at shutdown.

    * On startup we initialise the database (create tables if missing).
    * On shutdown we could close connections or clean up resources –
      currently there is nothing special to do.
    """
    # Initialise the DB – this will call the init_db helper which creates
    # tables via SQLModel.metadata.create_all (or the async variant).
    await db_service.init_db()
    yield
    # No explicit shutdown actions needed for the current setup.

app = FastAPI(title="LockedIn API", lifespan=lifespan)

# ---------------------------------------------------------------------------
# Middleware configuration
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] ,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Router registration
# ---------------------------------------------------------------------------
app.include_router(applications_router)

# ---------------------------------------------------------------------------
# Simple health/end‑point routes
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"message": "Welcome to LockedIn API"}

@app.get("/api/health")
def health():
    return {"status": "ok"}
