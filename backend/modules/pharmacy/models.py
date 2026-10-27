"""Pharmacy domain models."""

from __future__ import annotations

from datetime import datetime, date
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class MedicationForm(str, Enum):
    TABLET = "tablet"
    CAPSULE = "capsule"
    SYRUP = "syrup"
    INJECTION = "injection"
    CREAM = "cream"
    INHALER = "inhaler"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Medication(Base):
        __tablename__ = "pharmacy_medications"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
        generic_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        form: Mapped[MedicationForm] = mapped_column(SAEnum(MedicationForm), default=MedicationForm.TABLET)
        strength: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
        manufacturer: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        requires_prescription: Mapped[bool] = mapped_column(Boolean, default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "name": self.name,
                "generic_name": self.generic_name,
                "form": self.form.value if isinstance(self.form, MedicationForm) else self.form,
                "strength": self.strength,
                "manufacturer": self.manufacturer,
                "requires_prescription": self.requires_prescription,
            }

    class Stock(Base):
        __tablename__ = "pharmacy_stock"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        medication_id: Mapped[int] = mapped_column(ForeignKey("pharmacy_medications.id"), nullable=False, index=True)
        quantity: Mapped[int] = mapped_column(Integer, default=0)
        reorder_point: Mapped[int] = mapped_column(Integer, default=10)
        location: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
        updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class Lot(Base):
        __tablename__ = "pharmacy_lots"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        medication_id: Mapped[int] = mapped_column(ForeignKey("pharmacy_medications.id"), nullable=False, index=True)
        lot_number: Mapped[str] = mapped_column(String(60), nullable=False)
        quantity: Mapped[int] = mapped_column(Integer, default=0)
        expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
        received_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class Supplier(Base):
        __tablename__ = "pharmacy_suppliers"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        contact: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        email: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        phone: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)

    class Dispense(Base):
        __tablename__ = "pharmacy_dispenses"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        prescription_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
        medication_id: Mapped[int] = mapped_column(ForeignKey("pharmacy_medications.id"), nullable=False, index=True)
        quantity: Mapped[int] = mapped_column(Integer, nullable=False)
        dispensed_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        dispensed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    class Interaction(Base):
        __tablename__ = "pharmacy_interactions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        medication_a: Mapped[str] = mapped_column(String(120), nullable=False)
        medication_b: Mapped[str] = mapped_column(String(120), nullable=False)
        severity: Mapped[str] = mapped_column(String(40), nullable=False)
        description: Mapped[str] = mapped_column(Text, nullable=False)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Medication = None  # type: ignore
    Stock = None  # type: ignore
    Lot = None  # type: ignore
    Supplier = None  # type: ignore
    Dispense = None  # type: ignore
    Interaction = None  # type: ignore
