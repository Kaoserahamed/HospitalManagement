"""Medical coding domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class CodeSystem(str, Enum):
    ICD10 = "icd10"
    CPT = "cpt"
    HCPCS = "hcpcs"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class MedicalCode(Base):
        __tablename__ = "coding_codes"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        system: Mapped[CodeSystem] = mapped_column(SAEnum(CodeSystem), nullable=False, index=True)
        code: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
        description: Mapped[str] = mapped_column(String(500), nullable=False)
        category: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        is_billable: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class CodeMapping(Base):
        __tablename__ = "coding_mappings"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        source_system: Mapped[CodeSystem] = mapped_column(SAEnum(CodeSystem), nullable=False)
        source_code: Mapped[str] = mapped_column(String(20), nullable=False)
        target_system: Mapped[CodeSystem] = mapped_column(SAEnum(CodeSystem), nullable=False)
        target_code: Mapped[str] = mapped_column(String(20), nullable=False)
        confidence: Mapped[float] = mapped_column(default=1.0)

    class EncounterCode(Base):
        __tablename__ = "coding_encounter_codes"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        encounter_id: Mapped[int] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=False, index=True)
        system: Mapped[CodeSystem] = mapped_column(SAEnum(CodeSystem), nullable=False)
        code: Mapped[str] = mapped_column(String(20), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        is_primary: Mapped[bool] = mapped_column(default=False)
        added_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    MedicalCode = None  # type: ignore
    CodeMapping = None  # type: ignore
    EncounterCode = None  # type: ignore
