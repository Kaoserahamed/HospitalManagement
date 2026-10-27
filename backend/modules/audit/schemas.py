"""Audit Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class AuditLogBase(BaseModel):
    actor_id: Optional[int] = None
    action: str
    resource_type: str = Field(..., min_length=1, max_length=80)
    resource_id: Optional[int] = None
    severity: str = "info"
    ip_address: Optional[str] = Field(None, max_length=64)
    user_agent: Optional[str] = Field(None, max_length=240)
    metadata_json: Optional[str] = None


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogRead(AuditLogBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    occurred_at: Optional[datetime] = None


class AuditQuery(BaseModel):
    actor_id: Optional[int] = None
    action: Optional[str] = None
    resource_type: Optional[str] = None
    resource_id: Optional[int] = None
    severity: Optional[str] = None
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    page: int = 1
    per_page: int = 50
