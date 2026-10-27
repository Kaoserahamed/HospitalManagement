"""Backup Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class BackupBase(BaseModel):
    backup_type: str = "full"


class BackupCreate(BackupBase):
    pass


class BackupRead(BackupBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    file_path: Optional[str] = None
    size_bytes: Optional[int] = None
    checksum: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None
    created_at: Optional[datetime] = None


class RestoreBase(BaseModel):
    backup_id: int
    target: str = Field(..., min_length=1, max_length=120)


class RestoreCreate(RestoreBase):
    pass


class RestoreRead(RestoreBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None
    created_at: Optional[datetime] = None


class BackupScheduleBase(BaseModel):
    backup_type: str = "full"
    cron_expression: str = Field(..., min_length=1, max_length=80)
    retention_days: int = Field(30, ge=1)
    is_active: bool = True


class BackupScheduleCreate(BackupScheduleBase):
    pass


class BackupScheduleRead(BackupScheduleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    created_at: Optional[datetime] = None
