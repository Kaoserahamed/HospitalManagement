"""Care coordination Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CareTeamBase(BaseModel):
    patient_id: int
    name: str = Field(..., min_length=1, max_length=120)


class CareTeamCreate(CareTeamBase):
    pass


class CareTeamRead(CareTeamBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class CareTeamMemberBase(BaseModel):
    care_team_id: int
    user_id: int
    role: str = "consulting"


class CareTeamMemberCreate(CareTeamMemberBase):
    pass


class CareTeamMemberRead(CareTeamMemberBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    joined_at: Optional[datetime] = None


class CareTaskBase(BaseModel):
    patient_id: int
    assigned_to: Optional[int] = None
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: str = "normal"
    due_date: Optional[datetime] = None


class CareTaskCreate(CareTaskBase):
    pass


class CareTaskUpdate(BaseModel):
    assigned_to: Optional[int] = None
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None


class CareTaskRead(CareTaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "open"
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class HandoffBase(BaseModel):
    patient_id: int
    from_user: int
    to_user: int
    summary: str = Field(..., min_length=1)


class HandoffCreate(HandoffBase):
    pass


class HandoffRead(HandoffBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    created_at: Optional[datetime] = None
    acknowledged_at: Optional[datetime] = None


class DischargePlanBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    summary: str = Field(..., min_length=1)
    follow_up_appointments: Optional[str] = None
    medications: Optional[str] = None
    home_care_instructions: Optional[str] = None


class DischargePlanCreate(DischargePlanBase):
    pass


class DischargePlanRead(DischargePlanBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
