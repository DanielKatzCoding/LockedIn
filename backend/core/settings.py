from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = (
        f"{os.getenv('DATABASE_URL_PREFIX', 'postgresql+asyncpg')}://"
        f"{os.getenv('DB_USER', 'postgres_user')}:{os.getenv('DB_PASSWORD', 'postgres_password')}@"
        f"{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/"
        f"{os.getenv('DB_NAME', 'lockedin_db')}"
    )

    # Application settings
    APP_NAME: str = "LockedIn API"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    STATUS_TYPES: str = os.getenv("STATUS_TYPES", "Screening,Interview,Offer,Rejected")

settings = Settings()
