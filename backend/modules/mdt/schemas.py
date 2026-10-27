"""MDT Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MDTMeetingBase(BaseModel):
    patient_id: int
    title: str = Field(..., min_length=1, max_length=200)
    scheduled_at: datetime
    duration_minutes: int = Field(60, ge=15)
    location: Optional[str] = Field(None, max_length=120)
    notes: Optional[str] = None


class MDTMeetingCreate(MDTMeetingBase):
    pass


class MDTMeetingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(None, ge=15)
    location: Optional[str] = Field(None, max_length=120)
    notes: Optional[str] = None
    status: Optional[str] = None


class MDTMeetingRead(MDTMeetingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "scheduled"
    created_at: Optional[datetime] = None


class MDTAttendeeBase(BaseModel):
    meeting_id: int
    user_id: int
    role: str = Field(..., min_length=1, max_length=80)


class MDTAttendeeCreate(MDTAttendeeBase):
    pass


class MDTAttendeeRead(MDTAttendeeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    attended: bool = False


class MDTDecisionBase(BaseModel):
    meeting_id: int
    decision: str = Field(..., min_length=1)
    owner_id: Optional[int] = None
    due_date: Optional[datetime] = None


class MDTDecisionCreate(MDTDecisionBase):
    pass


class MDTDecisionRead(MDTDecisionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "open"
    created_at: Optional[datetime] = None
