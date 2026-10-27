"""Video consultation domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class SessionStatus(str, Enum):
    CREATED = "created"
    WAITING = "waiting"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    ENDED = "ended"
    FAILED = "failed"


class QualityLevel(str, Enum):
    HD = "hd"
    SD = "sd"
    LOW = "low"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class VideoSession(Base):
        __tablename__ = "video_sessions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        visit_id: Mapped[int] = mapped_column(ForeignKey("telemedicine_visits.id"), nullable=False, index=True)
        room_id: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
        status: Mapped[SessionStatus] = mapped_column(SAEnum(SessionStatus), default=SessionStatus.CREATED)
        quality: Mapped[QualityLevel] = mapped_column(SAEnum(QualityLevel), default=QualityLevel.SD)
        started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        recording_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        participant_count: Mapped[int] = mapped_column(Integer, default=0)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class SignalingMessage(Base):
        __tablename__ = "video_signaling"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        session_id: Mapped[int] = mapped_column(ForeignKey("video_sessions.id"), nullable=False, index=True)
        sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
        message_type: Mapped[str] = mapped_column(String(40), nullable=False)
        payload: Mapped[str] = mapped_column(Text, nullable=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class SessionMetric(Base):
        __tablename__ = "video_metrics"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        session_id: Mapped[int] = mapped_column(ForeignKey("video_sessions.id"), nullable=False, index=True)
        metric_name: Mapped[str] = mapped_column(String(60), nullable=False)
        metric_value: Mapped[float] = mapped_column(default=0.0)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    VideoSession = None  # type: ignore
    SignalingMessage = None  # type: ignore
    SessionMetric = None  # type: ignore
