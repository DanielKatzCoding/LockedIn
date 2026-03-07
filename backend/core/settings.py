from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres_user:postgres_password@localhost:5432/lockedin_db")

    # Application settings
    APP_NAME: str = "LockedIn API"
    DEBUG: bool = False

    env_file: str = ".env"
    env_file_encoding: str = "utf-8"


settings = Settings()