"""Patient portal Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MessageBase(BaseModel):
    sender_id: int
    recipient_id: int
    subject: Optional[str] = Field(None, max_length=200)
    body: str = Field(..., min_length=1)
    message_type: str = "text"


class MessageCreate(MessageBase):
    pass


class MessageRead(MessageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "sent"
    is_read: bool = False
    created_at: Optional[datetime] = None
    read_at: Optional[datetime] = None


class MessageUpdate(BaseModel):
    status: Optional[str] = None
    is_read: Optional[bool] = None


class Conversation(BaseModel):
    participant_id: int
    last_message: Optional[str] = None
    unread_count: int = 0
    last_activity: Optional[datetime] = None


class PrescriptionDownloadBase(BaseModel):
    prescription_id: int
    patient_id: int
    format: str = "pdf"
    ip_address: Optional[str] = None


class PrescriptionDownloadCreate(PrescriptionDownloadBase):
    pass


class PrescriptionDownloadRead(PrescriptionDownloadBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    downloaded_at: Optional[datetime] = None


class ReminderBase(BaseModel):
    patient_id: int
    reminder_type: str
    title: str = Field(..., min_length=1, max_length=200)
    body: str = Field(..., min_length=1)
    scheduled_at: datetime
    reference_id: Optional[int] = None


class ReminderCreate(ReminderBase):
    pass


class ReminderUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    body: Optional[str] = None
    scheduled_at: Optional[datetime] = None


class ReminderRead(ReminderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    sent_at: Optional[datetime] = None
    acknowledged_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class PortalSummary(BaseModel):
    unread_messages: int = 0
    pending_reminders: int = 0
    recent_downloads: int = 0
