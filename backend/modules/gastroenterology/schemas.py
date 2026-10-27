"""GastroenterologyCase Pydantic schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GastroenterologyCaseBase(BaseModel):
    patient_id: int | None = None
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    status: str = "draft"
    priority: str = "normal"
    category: str | None = None
    owner_id: int | None = None
    notes: str | None = None
    is_active: bool = True


class GastroenterologyCaseCreate(GastroenterologyCaseBase):
    pass


class GastroenterologyCaseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    category: str | None = None
    owner_id: int | None = None
    notes: str | None = None
    is_active: bool | None = None


class GastroenterologyCaseRead(GastroenterologyCaseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    due_date: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
