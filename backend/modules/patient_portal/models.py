"""Patient portal domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class MessageType(str, Enum):
    TEXT = "text"
    ATTACHMENT = "attachment"
    SYSTEM = "system"


class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"


class ReminderType(str, Enum):
    APPOINTMENT = "appointment"
    MEDICATION = "medication"
    FOLLOW_UP = "follow_up"
    LAB_RESULT = "lab_result"


class ReminderStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    ACKNOWLEDGED = "acknowledged"
    CANCELLED = "cancelled"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Message(Base):
        __tablename__ = "portal_messages"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
        recipient_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
        subject: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
        body: Mapped[str] = mapped_column(Text, nullable=False)
        message_type: Mapped[MessageType] = mapped_column(SAEnum(MessageType), default=MessageType.TEXT)
        status: Mapped[MessageStatus] = mapped_column(SAEnum(MessageStatus), default=MessageStatus.SENT)
        is_read: Mapped[bool] = mapped_column(Boolean, default=False)
        read_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "sender_id": self.sender_id,
                "recipient_id": self.recipient_id,
                "subject": self.subject,
                "body": self.body,
                "message_type": self.message_type.value if isinstance(self.message_type, MessageType) else self.message_type,
                "status": self.status.value if isinstance(self.status, MessageStatus) else self.status,
                "is_read": self.is_read,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "read_at": self.read_at.isoformat() if self.read_at else None,
            }

    class PrescriptionDownload(Base):
        __tablename__ = "portal_prescription_downloads"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        prescription_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        downloaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        ip_address: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
        format: Mapped[str] = mapped_column(String(10), default="pdf")

    class Reminder(Base):
        __tablename__ = "portal_reminders"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        reminder_type: Mapped[ReminderType] = mapped_column(SAEnum(ReminderType), nullable=False)
        title: Mapped[str] = mapped_column(String(200), nullable=False)
        body: Mapped[str] = mapped_column(Text, nullable=False)
        scheduled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        status: Mapped[ReminderStatus] = mapped_column(SAEnum(ReminderStatus), default=ReminderStatus.PENDING)
        sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        reference_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Message = None  # type: ignore
    PrescriptionDownload = None  # type: ignore
    Reminder = None  # type: ignore
