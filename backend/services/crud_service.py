from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from backend.model.job_application import CreateJobApplicationModel, JobApplicationModel
from backend.orm.schema import JobApplication
from datetime import date
from backend.enums.job_application import JobApplicationStatus


class CRUDService:
    """Service class for Job Application CRUD operations"""

    async def get_job_application(self, db: AsyncSession, job_application_id: str) -> Optional[JobApplication]:
        stmt = select(JobApplication).where(JobApplication.id == job_application_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_job_applications(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[JobApplication]:
        stmt = select(JobApplication).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def create_job_application(self, db: AsyncSession, job_application_data: CreateJobApplicationModel) -> JobApplication:
        db_job_application = JobApplication(**job_application_data.model_dump())
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

    async def update_job_application(self, db: AsyncSession, job_application_id: str, job_application_update: JobApplicationModel) -> Optional[JobApplication]:
        if job_application_id != job_application_update.id:
            return None  # ID mismatch, cannot update
        
        db_job_application = await self.get_job_application(db, job_application_id)
        if db_job_application is None:
            return None
        
        for key, value in job_application_update.model_dump(exclude_unset=True).items():
            # Convert date strings to date objects for date fields
            if key in ("application_date", "response_date"):
                try:
                    from datetime import date as dt
                    if isinstance(value, str):
                        value = dt.fromisoformat(value)
                except Exception:
                    pass
            # Convert status string to Enum if necessary
            elif key == "status" and isinstance(value, str):
                try:
                    from backend.enums.job_application import JobApplicationStatus
                    value = JobApplicationStatus(value)
                except ValueError:
                    pass
                
            setattr(db_job_application, key, value)
            
        await db.commit()
        await db.refresh(db_job_application)
        return db_job_application

    async def delete_job_application(self, db: AsyncSession, job_application_id: str) -> bool:
        db_job_application = await self.get_job_application(db, job_application_id)
        if db_job_application is None:
            return False

        await db.delete(db_job_application)
        await db.commit()
        return True