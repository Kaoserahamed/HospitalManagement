"""SurgeryCase Pydantic schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SurgeryCaseBase(BaseModel):
    patient_id: int | None = None
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    status: str = "draft"
    priority: str = "normal"
    category: str | None = None
    owner_id: int | None = None
    notes: str | None = None
    is_active: bool = True


class SurgeryCaseCreate(SurgeryCaseBase):
    pass


class SurgeryCaseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    category: str | None = None
    owner_id: int | None = None
    notes: str | None = None
    is_active: bool | None = None


class SurgeryCaseRead(SurgeryCaseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    due_date: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
