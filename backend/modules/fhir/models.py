"""FHIR R4 domain models and resource mappings."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class FHIRResourceType(str, Enum):
    PATIENT = "Patient"
    OBSERVATION = "Observation"
    ENCOUNTER = "Encounter"
    MEDICATION_REQUEST = "MedicationRequest"
    DIAGNOSTIC_REPORT = "DiagnosticReport"
    PRACTITIONER = "Practitioner"
    ORGANIZATION = "Organization"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class FHIRResource(Base):
        __tablename__ = "fhir_resources"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        resource_type: Mapped[FHIRResourceType] = mapped_column(SAEnum(FHIRResourceType), nullable=False, index=True)
        resource_id: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
        version: Mapped[int] = mapped_column(Integer, default=1)
        payload: Mapped[str] = mapped_column(Text, nullable=False)
        last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        source_system: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "resource_type": self.resource_type.value if isinstance(self.resource_type, FHIRResourceType) else self.resource_type,
                "resource_id": self.resource_id,
                "version": self.version,
                "payload": self.payload,
                "last_updated": self.last_updated.isoformat() if self.last_updated else None,
                "source_system": self.source_system,
            }

    class FHIRBundle(Base):
        __tablename__ = "fhir_bundles"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        bundle_type: Mapped[str] = mapped_column(String(40), nullable=False)
        total: Mapped[int] = mapped_column(Integer, default=0)
        payload: Mapped[str] = mapped_column(Text, nullable=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class FHIRSubscription(Base):
        __tablename__ = "fhir_subscriptions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        resource_type: Mapped[FHIRResourceType] = mapped_column(SAEnum(FHIRResourceType), nullable=False)
        criteria: Mapped[str] = mapped_column(String(240), nullable=False)
        channel_type: Mapped[str] = mapped_column(String(40), nullable=False)
        endpoint: Mapped[str] = mapped_column(String(500), nullable=False)
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    FHIRResource = None  # type: ignore
    FHIRBundle = None  # type: ignore
    FHIRSubscription = None  # type: ignore
