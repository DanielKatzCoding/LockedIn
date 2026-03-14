from datetime import date
from typing import Optional
from pydantic import BaseModel
from backend.enums.job_application import JobApplicationStatus

class CreateJobApplicationModel(BaseModel):
    company: Optional[str] = None
    job_title: Optional[str] = None
    application_date: Optional[date] = None
    job_link: Optional[str] = None
    status: Optional[JobApplicationStatus] = None
    response_date: Optional[date] = None
    notes: Optional[str] = None
    
class JobApplicationModel(BaseModel):
    id: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    application_date: Optional[date] = None
    job_link: Optional[str] = None
    status: Optional[JobApplicationStatus] = None
    response_date: Optional[date] = None
    notes: Optional[str] = None
    