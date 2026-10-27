"""Risk prediction domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class RiskModel(Base):
        __tablename__ = "risk_models"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        version: Mapped[str] = mapped_column(String(20), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        features: Mapped[str] = mapped_column(Text, nullable=False)  # JSON list
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class RiskPrediction(Base):
        __tablename__ = "risk_predictions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        model_id: Mapped[int] = mapped_column(ForeignKey("risk_models.id"), nullable=False, index=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        encounter_id: Mapped[Optional[int]] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=True)
        score: Mapped[float] = mapped_column(Float, nullable=False)
        risk_level: Mapped[RiskLevel] = mapped_column(SAEnum(RiskLevel), nullable=False)
        factors: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON
        predicted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class RiskFactor(Base):
        __tablename__ = "risk_factors"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        weight: Mapped[float] = mapped_column(Float, nullable=False)
        category: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    RiskModel = None  # type: ignore
    RiskPrediction = None  # type: ignore
    RiskFactor = None  # type: ignore
