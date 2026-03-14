from uuid import uuid4
from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional
from backend.enums.job_application import JobApplicationStatus


class JobApplication(SQLModel, table=True):
    __tablename__ = "job_applications"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    company: Optional[str] = None
    jobTitle: Optional[str] = None
    applicationDate: Optional[date] = None
    jobLink: Optional[str] = None
    status: Optional[JobApplicationStatus] = None
    responseDate: Optional[date] = None
    notes: Optional[str] = None
