from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional


class WeeklyReportCreate(BaseModel):
    week_start: date
    week_end: date

    project: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    tasks_completed: List[str]

    tasks_planned: List[str]

    blockers: Optional[str] = ""

    hours_worked: Optional[float] = Field(
        default=0,
        ge=0,
        le=168
    )

    notes: Optional[str] = ""



class WeeklyReportUpdate(BaseModel):
    week_start: Optional[date] = None
    week_end: Optional[date] = None

    project: Optional[str] = None

    tasks_completed: Optional[List[str]] = None

    tasks_planned: Optional[List[str]] = None

    blockers: Optional[str] = None

    hours_worked: Optional[float] = None

    notes: Optional[str] = None