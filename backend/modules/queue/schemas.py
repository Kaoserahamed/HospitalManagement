"""Queue Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TaskBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    payload: Optional[str] = None
    priority: str = "normal"
    max_attempts: int = Field(3, ge=1)


class TaskCreate(TaskBase):
    pass


class TaskRead(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "queued"
    attempts: int = 0
    error: Optional[str] = None
    created_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class TaskUpdate(BaseModel):
    status: Optional[str] = None
    error: Optional[str] = None
    attempts: Optional[int] = None
