"""BloodUnit Pydantic schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BloodUnitBase(BaseModel):
    patient_id: int | None = None
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    status: str = "draft"
    priority: str = "normal"
    category: str | None = None
    owner_id: int | None = None
    notes: str | None = None
    is_active: bool = True


class BloodUnitCreate(BloodUnitBase):
    pass


class BloodUnitUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    category: str | None = None
    owner_id: int | None = None
    notes: str | None = None
    is_active: bool | None = None


class BloodUnitRead(BloodUnitBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    due_date: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
