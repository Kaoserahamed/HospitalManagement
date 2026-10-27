"""Report builder domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class ReportType(str, Enum):
    TABULAR = "tabular"
    CHART = "chart"
    SUMMARY = "summary"


class ExportFormat(str, Enum):
    CSV = "csv"
    PDF = "pdf"
    XLSX = "xlsx"
    JSON = "json"


class DeliveryChannel(str, Enum):
    EMAIL = "email"
    IN_APP = "in_app"
    WEBHOOK = "webhook"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class ReportTemplate(Base):
        __tablename__ = "report_builder_templates"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        report_type: Mapped[ReportType] = mapped_column(SAEnum(ReportType), default=ReportType.TABULAR)
        query: Mapped[str] = mapped_column(Text, nullable=False)
        parameters: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON
        columns: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class ReportSchedule(Base):
        __tablename__ = "report_builder_schedules"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        template_id: Mapped[int] = mapped_column(ForeignKey("report_builder_templates.id"), nullable=False, index=True)
        cron_expression: Mapped[str] = mapped_column(String(80), nullable=False)
        export_format: Mapped[ExportFormat] = mapped_column(SAEnum(ExportFormat), default=ExportFormat.CSV)
        delivery_channel: Mapped[DeliveryChannel] = mapped_column(SAEnum(DeliveryChannel), default=DeliveryChannel.EMAIL)
        recipients: Mapped[str] = mapped_column(Text, nullable=False)  # comma-separated
        is_active: Mapped[bool] = mapped_column(default=True)
        last_run: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        next_run: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class ReportExport(Base):
        __tablename__ = "report_builder_exports"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        template_id: Mapped[int] = mapped_column(ForeignKey("report_builder_templates.id"), nullable=False, index=True)
        schedule_id: Mapped[Optional[int]] = mapped_column(ForeignKey("report_builder_schedules.id"), nullable=True)
        format: Mapped[ExportFormat] = mapped_column(SAEnum(ExportFormat), default=ExportFormat.CSV)
        file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        row_count: Mapped[int] = mapped_column(Integer, default=0)
        status: Mapped[str] = mapped_column(String(20), default="pending")
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class ReportDashboard(Base):
        __tablename__ = "report_builder_dashboards"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        widgets: Mapped[str] = mapped_column(Text, nullable=False)  # JSON
        is_default: Mapped[bool] = mapped_column(Boolean, default=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    ReportTemplate = None  # type: ignore
    ReportSchedule = None  # type: ignore
    ReportExport = None  # type: ignore
    ReportDashboard = None  # type: ignore
