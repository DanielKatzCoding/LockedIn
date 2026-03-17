import sys
import os
import pytest

# Add project root to sys.path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# Use a file‑based SQLite database for tests (will be cleaned up manually if needed)
DB_FILENAME = "./test_db.db"
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{DB_FILENAME}"

from backend.services.database_service import db_service
import httpx

# ----------------------------------------------------------------------
@pytest.fixture
async def async_client():
    # Ensure a clean database for each test
    from sqlmodel import SQLModel
    async with db_service.engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
    await db_service.init_db()
    from backend.app import app
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

@pytest.fixture
def sample_job_data():
    from datetime import date
    from backend.model.job_application import CreateJobApplicationModel
    payload = CreateJobApplicationModel(
        company="Acme Corp",
        jobTitle="Software Engineer",
        applicationDate=date(2023, 1, 1),
        jobLink="https://example.com/job",
        responseDate=date(2023, 1, 15),
        status="Applied",
        notes="First interview scheduled",
    ).model_dump(mode="json")
    return payload
