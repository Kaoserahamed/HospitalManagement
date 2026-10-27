"""Import/Export domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class ImportStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ExportStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class ImportJob(Base):
        __tablename__ = "import_export_imports"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        entity_type: Mapped[str] = mapped_column(String(60), nullable=False)
        file_name: Mapped[str] = mapped_column(String(240), nullable=False)
        file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        status: Mapped[ImportStatus] = mapped_column(SAEnum(ImportStatus), default=ImportStatus.PENDING)
        total_rows: Mapped[int] = mapped_column(Integer, default=0)
        processed_rows: Mapped[int] = mapped_column(Integer, default=0)
        error_rows: Mapped[int] = mapped_column(Integer, default=0)
        errors: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class ExportJob(Base):
        __tablename__ = "import_export_exports"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        entity_type: Mapped[str] = mapped_column(String(60), nullable=False)
        format: Mapped[str] = mapped_column(String(10), nullable=False)
        filters: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        row_count: Mapped[int] = mapped_column(Integer, default=0)
        status: Mapped[ExportStatus] = mapped_column(SAEnum(ExportStatus), default=ExportStatus.PENDING)
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    ImportJob = None  # type: ignore
    ExportJob = None  # type: ignore
