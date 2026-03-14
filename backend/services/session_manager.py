from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.core.settings import settings


# Create SQLAlchemy async engine
engine = create_async_engine(settings.DATABASE_URL)

# Create AsyncSession class
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)


async def get_db():
    """Dependency to get DB session"""
    async with AsyncSessionLocal() as session:
        yield session


async def init_db():
    """Initialize database and create tables"""
    # Ensure ORM models are imported so their metadata is registered
    from sqlmodel import SQLModel

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)
