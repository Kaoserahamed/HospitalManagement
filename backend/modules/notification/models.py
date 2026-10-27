"""Notification domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class NotificationChannel(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    IN_APP = "in_app"
    PUSH = "push"


class NotificationStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    READ = "read"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Notification(Base):
        __tablename__ = "notifications"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        recipient_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
        channel: Mapped[NotificationChannel] = mapped_column(SAEnum(NotificationChannel), default=NotificationChannel.IN_APP)
        subject: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
        body: Mapped[str] = mapped_column(Text, nullable=False)
        status: Mapped[NotificationStatus] = mapped_column(SAEnum(NotificationStatus), default=NotificationStatus.PENDING)
        is_read: Mapped[bool] = mapped_column(Boolean, default=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        read_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "recipient_id": self.recipient_id,
                "channel": self.channel.value if isinstance(self.channel, NotificationChannel) else self.channel,
                "subject": self.subject,
                "body": self.body,
                "status": self.status.value if isinstance(self.status, NotificationStatus) else self.status,
                "is_read": self.is_read,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "sent_at": self.sent_at.isoformat() if self.sent_at else None,
                "read_at": self.read_at.isoformat() if self.read_at else None,
            }

    class NotificationTemplate(Base):
        __tablename__ = "notification_templates"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
        channel: Mapped[NotificationChannel] = mapped_column(SAEnum(NotificationChannel), default=NotificationChannel.EMAIL)
        subject: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
        body_template: Mapped[str] = mapped_column(Text, nullable=False)
        is_active: Mapped[bool] = mapped_column(Boolean, default=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Notification = None  # type: ignore
    NotificationTemplate = None  # type: ignore
