"""Reporting domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class ReportFormat(str, Enum):
    CSV = "csv"
    PDF = "pdf"
    JSON = "json"
    XLSX = "xlsx"


class ReportSchedule(str, Enum):
    ONCE = "once"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class ReportDefinition(Base):
        __tablename__ = "report_definitions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        query: Mapped[str] = mapped_column(Text, nullable=False)
        parameters: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        format: Mapped[ReportFormat] = mapped_column(SAEnum(ReportFormat), default=ReportFormat.CSV)
        schedule: Mapped[ReportSchedule] = mapped_column(SAEnum(ReportSchedule), default=ReportSchedule.ONCE)
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class ReportExecution(Base):
        __tablename__ = "report_executions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        definition_id: Mapped[int] = mapped_column(ForeignKey("report_definitions.id"), nullable=False, index=True)
        status: Mapped[str] = mapped_column(String(20), default="pending")
        row_count: Mapped[int] = mapped_column(Integer, default=0)
        file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class ReportSubscription(Base):
        __tablename__ = "report_subscriptions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        definition_id: Mapped[int] = mapped_column(ForeignKey("report_definitions.id"), nullable=False, index=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
        delivery_channel: Mapped[str] = mapped_column(String(40), default="email")
        is_active: Mapped[bool] = mapped_column(default=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    ReportDefinition = None  # type: ignore
    ReportExecution = None  # type: ignore
    ReportSubscription = None  # type: ignore
