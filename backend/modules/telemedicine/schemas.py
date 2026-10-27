"""Telemedicine Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class VirtualVisitBase(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_id: Optional[int] = None
    scheduled_start: datetime
    scheduled_end: datetime
    notes: Optional[str] = None


class VirtualVisitCreate(VirtualVisitBase):
    pass


class VirtualVisitUpdate(BaseModel):
    status: Optional[str] = None
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    session_quality: Optional[str] = None
    recording_url: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = None


class VirtualVisitRead(VirtualVisitBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "scheduled"
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    waiting_room_entered_at: Optional[datetime] = None
    session_quality: Optional[str] = None
    recording_url: Optional[str] = None
    created_at: Optional[datetime] = None


class WaitingRoomEntry(BaseModel):
    visit_id: int
    patient_id: int


class WaitingRoomRead(WaitingRoomEntry):
    model_config = ConfigDict(from_attributes=True)

    id: int
    entered_at: Optional[datetime] = None
    position: int = 0
    is_admitted: bool = False


class SessionMetricCreate(BaseModel):
    visit_id: int
    metric_name: str = Field(..., min_length=1, max_length=80)
    metric_value: float = 0.0


class SessionMetricRead(SessionMetricCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class VisitSummary(BaseModel):
    total_visits: int = 0
    completed: int = 0
    cancelled: int = 0
    no_show: int = 0
    avg_duration_minutes: float = 0.0
