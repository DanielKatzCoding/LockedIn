from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from services.database_service import db_service
from backend.orm.schema import JobApplication

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.get("/", response_model=List[JobApplication])
async def get_job_applications(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(db_service.get_db)):
    job_applications = await db_service.crud.get_job_applications(db, skip=skip, limit=limit)
    return job_applications

@router.post("/create", response_model=JobApplication, status_code=status.HTTP_201_CREATED)
async def create_new_job_application(job_application: JobApplication, db: AsyncSession = Depends(db_service.get_db)):
    return await db_service.crud.create_job_application(db=db, job_application_data=job_application.model_dump())

@router.post("/create/empty", response_model=JobApplication, status_code=status.HTTP_201_CREATED)
async def create_new_empty_job_application(db: AsyncSession = Depends(db_service.get_db)):
    return await db_service.crud.create_empty_job_application(db=db)


@router.get("/{job_application_id}", response_model=JobApplication)
async def read_job_application(job_application_id: int, db: AsyncSession = Depends(db_service.get_db)):
    db_job_application = await db_service.crud.get_job_application(db, job_application_id=job_application_id)
    if db_job_application is None:
        raise HTTPException(status_code=404, detail="Job application not found")
    return db_job_application


@router.put("/{job_application_id}", response_model=JobApplication)
async def update_existing_job_application(
    job_application_id: int,
    job_application: JobApplication,
    db: AsyncSession = Depends(db_service.get_db)
):
    db_job_application = await db_service.crud.update_job_application(
        db,
        job_application_id=job_application_id,
        job_application_update=job_application.model_dump(exclude_unset=True)
    )
    if db_job_application is None:
        raise HTTPException(status_code=404, detail="Job application not found")
    return db_job_application


@router.delete("/{job_application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_job_application(job_application_id: int, db: AsyncSession = Depends(db_service.get_db)):
    success = await db_service.crud.delete_job_application(db, job_application_id=job_application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job application not found")
    return