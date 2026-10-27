"""Check-in Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CheckInBase(BaseModel):
    patient_id: int
    appointment_id: Optional[int] = None
    department_id: Optional[int] = None
    priority: str = "normal"
    notes: Optional[str] = None


class CheckInCreate(CheckInBase):
    pass


class CheckInUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    estimated_wait_minutes: Optional[int] = None
    notes: Optional[str] = None


class CheckInRead(CheckInBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "checked_in"
    checked_in_at: Optional[datetime] = None
    called_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    estimated_wait_minutes: Optional[int] = None


class QueueEntryBase(BaseModel):
    checkin_id: int
    department_id: Optional[int] = None
    position: int
    priority: str = "normal"
    estimated_wait: Optional[int] = None


class QueueEntryCreate(QueueEntryBase):
    pass


class QueueEntryRead(QueueEntryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class KioskSessionBase(BaseModel):
    patient_id: Optional[int] = None
    actions: Optional[str] = None


class KioskSessionCreate(KioskSessionBase):
    pass


class KioskSessionRead(KioskSessionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None


class QueueStats(BaseModel):
    total_waiting: int = 0
    avg_wait_minutes: float = 0.0
    longest_wait_minutes: int = 0
