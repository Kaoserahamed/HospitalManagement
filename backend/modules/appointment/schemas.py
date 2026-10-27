"""Appointment Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    department_id: Optional[int] = None
    start_time: datetime
    end_time: datetime
    appointment_type: str = "consultation"
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None
    appointment_type: Optional[str] = None
    notes: Optional[str] = None
    doctor_id: Optional[int] = None
    department_id: Optional[int] = None


class AppointmentRead(AppointmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "scheduled"
    duration_minutes: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class AppointmentListParams(BaseModel):
    page: int = 1
    per_page: int = 20
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = None
    status: Optional[str] = None
    start_from: Optional[datetime] = None
    start_to: Optional[datetime] = None


class SlotCreate(BaseModel):
    doctor_id: int
    start_time: datetime
    end_time: datetime


class SlotRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    doctor_id: int
    start_time: datetime
    end_time: datetime
    is_booked: bool = False
    appointment_id: Optional[int] = None


class ConflictCheck(BaseModel):
    doctor_id: int
    start_time: datetime
    end_time: datetime
    exclude_appointment_id: Optional[int] = None
