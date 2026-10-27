"""Escalation Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class EscalationPolicyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    levels: str
    is_active: bool = True


class EscalationPolicyCreate(EscalationPolicyBase):
    pass


class EscalationPolicyRead(EscalationPolicyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class EscalationBase(BaseModel):
    source_type: str = Field(..., min_length=1, max_length=60)
    source_id: int
    patient_id: int
    level: str = "level1"
    assigned_to: Optional[int] = None
    notes: Optional[str] = None


class EscalationCreate(EscalationBase):
    pass


class EscalationUpdate(BaseModel):
    level: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None
    notes: Optional[str] = None


class EscalationRead(EscalationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "open"
    created_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
