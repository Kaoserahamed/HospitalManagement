"""Notification Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class NotificationBase(BaseModel):
    recipient_id: int
    channel: str = "in_app"
    subject: Optional[str] = Field(None, max_length=200)
    body: str = Field(..., min_length=1)


class NotificationCreate(NotificationBase):
    pass


class NotificationRead(NotificationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    is_read: bool = False
    created_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None


class NotificationTemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    channel: str = "email"
    subject: Optional[str] = Field(None, max_length=200)
    body_template: str = Field(..., min_length=1)
    is_active: bool = True


class NotificationTemplateCreate(NotificationTemplateBase):
    pass


class NotificationTemplateRead(NotificationTemplateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class BulkNotificationCreate(BaseModel):
    recipient_ids: list[int]
    channel: str = "in_app"
    subject: Optional[str] = None
    body: str
