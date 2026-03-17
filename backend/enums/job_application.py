import os
from enum import Enum
from typing import Dict, List
from backend.core.settings import settings

# ----------------------------------------------------------------------
# Helper: Build the enum mapping from the ``STATUS_TYPES`` environment
# variable. Each status is expected to be a comma‑separated string, e.g.:
#   STATUS_TYPES=Applied,Phone Screen,Interview,Offer,Rejected
# If the variable is missing or empty we fall back to the original static list.
# ----------------------------------------------------------------------

def _load_statuses_from_env() -> Dict[str, str]:
    raw = settings.STATUS_TYPES
    # Original static fallback – matches the previous hard‑coded values.
    fallback: List[str] = [
        "Applied",
        "Phone Screen",
        "Interview",
        "Rejected",
        "Offer",
    ]

    if not raw:
        items = fallback
    else:
        # Split on commas, strip whitespace, ignore empty fragments.
        items = [s.strip() for s in raw.split(",") if s.strip()]
        if not items:
            items = fallback

    enum_dict: Dict[str, str] = {}
    for value in items:
        # Convert to a valid Python identifier for the enum member name.
        member_name = (
            value.upper()
            .replace("-", "_")
            .replace(" ", "_")
            .replace(".", "_")
        )
        enum_dict[member_name] = value
    return enum_dict

# Dynamically create the Enum at import time.
JobApplicationStatus = Enum("JobApplicationStatus", _load_statuses_from_env())
