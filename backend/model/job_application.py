from datetime import date
from typing import Optional
from pydantic import BaseModel
from backend.enums.job_application import JobApplicationStatus

class CreateJobApplicationModel(BaseModel):
    company: Optional[str] = None
    jobTitle: Optional[str] = None
    applicationDate: Optional[date] = None
    jobLink: Optional[str] = None
    status: Optional[JobApplicationStatus] = None
    responseDate: Optional[date] = None
    notes: Optional[str] = None

class JobApplicationModel(BaseModel):
    id: Optional[str] = None
    company: Optional[str] = None
    jobTitle: Optional[str] = None
    applicationDate: Optional[date] = None
    jobLink: Optional[str] = None
    status: Optional[JobApplicationStatus] = None
    responseDate: Optional[date] = None
    notes: Optional[str] = None
