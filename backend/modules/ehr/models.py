"""EHR domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text, Float
from sqlalchemy.orm import Mapped, mapped_column


class EncounterStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    FINALIZED = "finalized"
    AMENDED = "amended"


class EncounterType(str, Enum):
    OUTPATIENT = "outpatient"
    INPATIENT = "inpatient"
    EMERGENCY = "emergency"
    TELEHEALTH = "telehealth"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Encounter(Base):
        __tablename__ = "ehr_encounters"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.id"), nullable=False, index=True)
        appointment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("appointments.id"), nullable=True)
        encounter_type: Mapped[EncounterType] = mapped_column(SAEnum(EncounterType), default=EncounterType.OUTPATIENT)
        status: Mapped[EncounterStatus] = mapped_column(SAEnum(EncounterStatus), default=EncounterStatus.OPEN)
        chief_complaint: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        subjective: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        objective: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        assessment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        plan: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        finalized_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        finalized_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "patient_id": self.patient_id,
                "doctor_id": self.doctor_id,
                "appointment_id": self.appointment_id,
                "encounter_type": self.encounter_type.value if isinstance(self.encounter_type, EncounterType) else self.encounter_type,
                "status": self.status.value if isinstance(self.status, EncounterStatus) else self.status,
                "chief_complaint": self.chief_complaint,
                "subjective": self.subjective,
                "objective": self.objective,
                "assessment": self.assessment,
                "plan": self.plan,
                "started_at": self.started_at.isoformat() if self.started_at else None,
                "ended_at": self.ended_at.isoformat() if self.ended_at else None,
                "finalized_at": self.finalized_at.isoformat() if self.finalized_at else None,
            }

    class Vital(Base):
        __tablename__ = "ehr_vitals"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        encounter_id: Mapped[int] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=False, index=True)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        blood_pressure_systolic: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        blood_pressure_diastolic: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        heart_rate: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        temperature_c: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
        respiratory_rate: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        oxygen_saturation: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
        weight_kg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
        height_cm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    class Diagnosis(Base):
        __tablename__ = "ehr_diagnoses"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        encounter_id: Mapped[int] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=False, index=True)
        code: Mapped[str] = mapped_column(String(20), nullable=False)
        description: Mapped[str] = mapped_column(String(240), nullable=False)
        is_primary: Mapped[bool] = mapped_column(default=False)
        noted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class LabResult(Base):
        __tablename__ = "ehr_lab_results"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        encounter_id: Mapped[int] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=False, index=True)
        test_name: Mapped[str] = mapped_column(String(120), nullable=False)
        value: Mapped[str] = mapped_column(String(120), nullable=False)
        unit: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
        reference_range: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
        abnormal: Mapped[bool] = mapped_column(default=False)
        resulted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class Prescription(Base):
        __tablename__ = "ehr_prescriptions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        encounter_id: Mapped[int] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=False, index=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.id"), nullable=False, index=True)
        medication: Mapped[str] = mapped_column(String(120), nullable=False)
        dosage: Mapped[str] = mapped_column(String(80), nullable=False)
        frequency: Mapped[str] = mapped_column(String(80), nullable=False)
        duration: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
        instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        issued_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Encounter = None  # type: ignore
    Vital = None  # type: ignore
    Diagnosis = None  # type: ignore
    LabResult = None  # type: ignore
    Prescription = None  # type: ignore
