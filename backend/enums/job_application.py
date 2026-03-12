from enum import Enum


class JobApplicationStatus(Enum):
    APPLIED = "Applied"
    PHONE_SCREEN = "Phone Screen"
    INTERVIEW = "Interview"
    REJECTED = "Rejected"
    OFFER = "Offer"