"""Patient domain models."""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Enum as SAEnum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.shared import events


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    UNSPECIFIED = "unspecified"


class PatientStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DECEASED = "deceased"


# SQLAlchemy model (imported lazily to avoid circular deps in tests)
try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Patient(Base):
        __tablename__ = "patients"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        first_name: Mapped[str] = mapped_column(String(100), nullable=False)
        last_name: Mapped[str] = mapped_column(String(100), nullable=False)
        dob: Mapped[date] = mapped_column(Date, nullable=False)
        gender: Mapped[Gender] = mapped_column(SAEnum(Gender), default=Gender.UNSPECIFIED)
        phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
        address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        insurance_provider: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        insurance_number: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        status: Mapped[PatientStatus] = mapped_column(SAEnum(PatientStatus), default=PatientStatus.ACTIVE)
        is_active: Mapped[bool] = mapped_column(Boolean, default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        user = relationship("User", backref="patient_profile", lazy="selectin")
        allergies: Mapped[list["Allergy"]] = relationship(back_populates="patient", cascade="all, delete-orphan")
        insurance: Mapped[Optional["Insurance"]] = relationship(back_populates="patient", uselist=False)

        @property
        def full_name(self) -> str:
            return f"{self.first_name} {self.last_name}".strip()

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "user_id": self.user_id,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "full_name": self.full_name,
                "dob": self.dob.isoformat() if self.dob else None,
                "gender": self.gender.value if isinstance(self.gender, Gender) else self.gender,
                "phone": self.phone,
                "address": self.address,
                "insurance_provider": self.insurance_provider,
                "insurance_number": self.insurance_number,
                "status": self.status.value if isinstance(self.status, PatientStatus) else self.status,
                "is_active": self.is_active,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            }

    class Allergy(Base):
        __tablename__ = "patient_allergies"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False)
        substance: Mapped[str] = mapped_column(String(120), nullable=False)
        reaction: Mapped[Optional[str]] = mapped_column(String(240), nullable=True)
        severity: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

        patient = relationship("Patient", back_populates="allergies")

    class Insurance(Base):
        __tablename__ = "patient_insurance"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), unique=True, nullable=False)
        provider: Mapped[str] = mapped_column(String(120), nullable=False)
        policy_number: Mapped[str] = mapped_column(String(120), nullable=False)
        group_number: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        effective_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
        expiry_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

        patient = relationship("Patient", back_populates="insurance")

except Exception:  # pragma: no cover - fallback when SQLAlchemy unavailable
    Base = object  # type: ignore
    Patient = None  # type: ignore
    Allergy = None  # type: ignore
    Insurance = None  # type: ignore


def patient_created_payload(patient) -> dict:
    return {"patient_id": getattr(patient, "id", None), "name": getattr(patient, "full_name", None)}
