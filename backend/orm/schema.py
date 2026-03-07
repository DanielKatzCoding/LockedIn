from uuid import uuid4, UUID
from sqlmodel import SQLModel, Field
from datetime import datetime, date
from typing import Optional
from enum import Enum


class JobApplicationStatus(Enum):
    APPLIED = "Applied"
    PHONE_SCREEN = "Phone Screen"
    INTERVIEW = "Interview"
    REJECTED = "Rejected"
    OFFER = "Offer"


class JobApplication(SQLModel, table=True):
    __tablename__ = "job_applications"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    company: Optional[str] = None
    job_title: Optional[str] = None
    application_date: Optional[date] = None
    job_link: Optional[str] = None
    status: Optional[JobApplicationStatus] = None
    response_date: Optional[date] = None
    notes: Optional[str] = None
    