"""Clinical decision support models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class RuleType(str, Enum):
    DRUG_INTERACTION = "drug_interaction"
    ALLERGY_ALERT = "allergy_alert"
    DOSAGE_CHECK = "dosage_check"
    DIAGNOSIS_SUGGESTION = "diagnosis_suggestion"
    CARE_GAP = "care_gap"


class AlertLevel(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class CDSRule(Base):
        __tablename__ = "cds_rules"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        rule_type: Mapped[RuleType] = mapped_column(SAEnum(RuleType), nullable=False)
        condition: Mapped[str] = mapped_column(Text, nullable=False)
        action: Mapped[str] = mapped_column(Text, nullable=False)
        priority: Mapped[int] = mapped_column(Integer, default=0)
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class CDSAlert(Base):
        __tablename__ = "cds_alerts"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        encounter_id: Mapped[Optional[int]] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=True)
        rule_id: Mapped[Optional[int]] = mapped_column(ForeignKey("cds_rules.id"), nullable=True)
        alert_level: Mapped[AlertLevel] = mapped_column(SAEnum(AlertLevel), default=AlertLevel.INFO)
        message: Mapped[str] = mapped_column(Text, nullable=False)
        acknowledged: Mapped[bool] = mapped_column(default=False)
        acknowledged_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class DrugDoseRange(Base):
        __tablename__ = "cds_dose_ranges"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        medication: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
        min_dose: Mapped[float] = mapped_column(Float, nullable=False)
        max_dose: Mapped[float] = mapped_column(Float, nullable=False)
        unit: Mapped[str] = mapped_column(String(40), nullable=False)
        age_min: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        age_max: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    CDSRule = None  # type: ignore
    CDSAlert = None  # type: ignore
    DrugDoseRange = None  # type: ignore
