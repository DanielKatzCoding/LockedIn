from .session_manager import get_db, init_db, engine, AsyncSessionLocal
from .crud_service import CRUDService


class DatabaseService:
    """Simple service that provides access to session management and CRUD operations"""

    def __init__(self):
        self.crud = CRUDService()
        self.get_db = get_db
        self.init_db = init_db
        self.engine = engine
        self.AsyncSessionLocal = AsyncSessionLocal


# Global instance for easy access
db_service = DatabaseService()

__all__ = ["DatabaseService", "db_service", "get_db", "init_db", "engine", "AsyncSessionLocal", "CRUDService"]
