"""Scheduling Pydantic schemas."""

from __future__ import annotations

from datetime import date, datetime, time
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ShiftSwapBase(BaseModel):
    requester_id: int
    target_id: int
    requester_shift_id: int
    target_shift_id: int
    reason: Optional[str] = None


class ShiftSwapCreate(ShiftSwapBase):
    pass


class ShiftSwapUpdate(BaseModel):
    status: Optional[str] = None
    reviewed_by: Optional[int] = None


class ShiftSwapRead(ShiftSwapBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    created_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None


class OnCallBase(BaseModel):
    department_id: int
    staff_id: int
    on_call_type: str = "primary"
    start_time: datetime
    end_time: datetime


class OnCallCreate(OnCallBase):
    pass


class OnCallRead(OnCallBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None


class CoverageAlertBase(BaseModel):
    department_id: int
    date: date
    shift_type: str
    status: str = "gap"
    message: str


class CoverageAlertCreate(CoverageAlertBase):
    pass


class CoverageAlertRead(CoverageAlertBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    acknowledged: bool = False
    created_at: Optional[datetime] = None


class ShiftTemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    department_id: int
    shift_type: str
    start_time: time
    end_time: time
    days_of_week: str
    is_active: bool = True


class ShiftTemplateCreate(ShiftTemplateBase):
    pass


class ShiftTemplateRead(ShiftTemplateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class AvailabilityBase(BaseModel):
    staff_id: int
    day_of_week: int = Field(..., ge=0, le=6)
    start_time: time
    end_time: time
    is_available: bool = True


class AvailabilityCreate(AvailabilityBase):
    pass


class AvailabilityRead(AvailabilityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ScheduleSummary(BaseModel):
    department_id: int
    date: date
    total_shifts: int = 0
    covered_shifts: int = 0
    gaps: int = 0
    coverage_rate: float = 0.0
