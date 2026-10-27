"""DICOM metadata domain models."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class DicomStudy(Base):
        __tablename__ = "dicom_studies"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        study_instance_uid: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        modality: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
        study_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        description: Mapped[Optional[str]] = mapped_column(String(240), nullable=True)
        storage_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "study_instance_uid": self.study_instance_uid,
                "patient_id": self.patient_id,
                "modality": self.modality,
                "study_date": self.study_date.isoformat() if self.study_date else None,
                "description": self.description,
                "storage_path": self.storage_path,
            }

    class DicomSeries(Base):
        __tablename__ = "dicom_series"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        study_id: Mapped[int] = mapped_column(ForeignKey("dicom_studies.id"), nullable=False, index=True)
        series_instance_uid: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
        modality: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
        series_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        instance_count: Mapped[int] = mapped_column(Integer, default=0)

    class DicomInstance(Base):
        __tablename__ = "dicom_instances"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        series_id: Mapped[int] = mapped_column(ForeignKey("dicom_series.id"), nullable=False, index=True)
        sop_instance_uid: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
        instance_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        storage_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        file_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    DicomStudy = None  # type: ignore
    DicomSeries = None  # type: ignore
    DicomInstance = None  # type: ignore
