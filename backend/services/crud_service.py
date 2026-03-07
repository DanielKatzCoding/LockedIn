from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from backend.orm.schema import JobApplication


class CRUDService:
    """Service class for Job Application CRUD operations"""

    async def get_job_application(self, db: AsyncSession, job_application_id: int) -> Optional[JobApplication]:
        stmt = select(JobApplication).where(JobApplication.id == job_application_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_job_applications(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[JobApplication]:
        stmt = select(JobApplication).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def create_job_application(self, db: AsyncSession, job_application_data: dict) -> JobApplication:
        db_job_application = JobApplication(**job_application_data)
        db.add(db_job_application)
        await db.commit()
        await db.refresh(db_job_application)
        return db_job_application
    
    async def create_empty_job_application(self, db: AsyncSession) -> JobApplication:
        db_job_application = JobApplication()
        db.add(db_job_application)
        await db.commit()
        await db.refresh(db_job_application)
        return db_job_application

    async def update_job_application(self, db: AsyncSession, job_application_data: dict) -> Optional[JobApplication]:
        db_job_application = await self.get_job_application(db, job_application_data["id"])
        if db_job_application is None:
            return None

        for key, value in job_application_data.items():
            setattr(db_job_application, key, value)

        await db.commit()
        await db.refresh(db_job_application)
        return db_job_application

    async def delete_job_application(self, db: AsyncSession, job_application_id: int) -> bool:
        db_job_application = await self.get_job_application(db, job_application_id)
        if db_job_application is None:
            return False

        await db.delete(db_job_application)
        await db.commit()
        return True