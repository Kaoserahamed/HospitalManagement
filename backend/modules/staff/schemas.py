"""Staff Pydantic schemas."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class StaffProfileBase(BaseModel):
    user_id: int
    department_id: Optional[int] = None
    title: Optional[str] = Field(None, max_length=80)
    specialty: Optional[str] = Field(None, max_length=120)
    license_number: Optional[str] = Field(None, max_length=80)
    phone: Optional[str] = Field(None, max_length=30)
    hired_at: Optional[date] = None


class StaffProfileCreate(StaffProfileBase):
    pass


class StaffProfileUpdate(BaseModel):
    department_id: Optional[int] = None
    title: Optional[str] = Field(None, max_length=80)
    specialty: Optional[str] = Field(None, max_length=120)
    license_number: Optional[str] = Field(None, max_length=80)
    phone: Optional[str] = Field(None, max_length=30)
    is_active: Optional[bool] = None


class StaffProfileRead(StaffProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None


class ShiftBase(BaseModel):
    staff_id: int
    department_id: Optional[int] = None
    shift_type: str = "morning"
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None


class ShiftCreate(ShiftBase):
    pass


class ShiftRead(ShiftBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class TimeOffBase(BaseModel):
    staff_id: int
    start_date: date
    end_date: date
    reason: Optional[str] = None


class TimeOffCreate(TimeOffBase):
    pass


class TimeOffUpdate(BaseModel):
    status: Optional[str] = None
    reviewed_by: Optional[int] = None


class TimeOffRead(TimeOffBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    reviewed_by: Optional[int] = None
    created_at: Optional[datetime] = None


class RosterEntry(BaseModel):
    department_id: int
    date: date
    staff_id: int
    shift_type: str = "morning"


class RosterRead(RosterEntry):
    model_config = ConfigDict(from_attributes=True)

    id: int
