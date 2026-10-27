"""Billing domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    ISSUED = "issued"
    PAID = "paid"
    PARTIALLY_PAID = "partially_paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class PaymentMethod(str, Enum):
    CASH = "cash"
    CARD = "card"
    INSURANCE = "insurance"
    BANK_TRANSFER = "bank_transfer"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Charge(Base):
        __tablename__ = "billing_charges"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        encounter_id: Mapped[Optional[int]] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=True)
        code: Mapped[str] = mapped_column(String(20), nullable=False)
        description: Mapped[str] = mapped_column(String(240), nullable=False)
        quantity: Mapped[int] = mapped_column(Integer, default=1)
        unit_price: Mapped[float] = mapped_column(Float, nullable=False)
        total: Mapped[float] = mapped_column(Float, nullable=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "patient_id": self.patient_id,
                "encounter_id": self.encounter_id,
                "code": self.code,
                "description": self.description,
                "quantity": self.quantity,
                "unit_price": self.unit_price,
                "total": self.total,
            }

    class Invoice(Base):
        __tablename__ = "billing_invoices"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        invoice_number: Mapped[str] = mapped_column(String(40), nullable=False, unique=True)
        status: Mapped[InvoiceStatus] = mapped_column(SAEnum(InvoiceStatus), default=InvoiceStatus.DRAFT)
        subtotal: Mapped[float] = mapped_column(Float, default=0.0)
        tax: Mapped[float] = mapped_column(Float, default=0.0)
        total: Mapped[float] = mapped_column(Float, default=0.0)
        issued_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class InvoiceItem(Base):
        __tablename__ = "billing_invoice_items"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        invoice_id: Mapped[int] = mapped_column(ForeignKey("billing_invoices.id"), nullable=False, index=True)
        charge_id: Mapped[Optional[int]] = mapped_column(ForeignKey("billing_charges.id"), nullable=True)
        description: Mapped[str] = mapped_column(String(240), nullable=False)
        quantity: Mapped[int] = mapped_column(Integer, default=1)
        unit_price: Mapped[float] = mapped_column(Float, nullable=False)
        total: Mapped[float] = mapped_column(Float, nullable=False)

    class Payment(Base):
        __tablename__ = "billing_payments"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        invoice_id: Mapped[int] = mapped_column(ForeignKey("billing_invoices.id"), nullable=False, index=True)
        amount: Mapped[float] = mapped_column(Float, nullable=False)
        method: Mapped[PaymentMethod] = mapped_column(SAEnum(PaymentMethod), default=PaymentMethod.CASH)
        reference: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        paid_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class InsuranceClaim(Base):
        __tablename__ = "billing_claims"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        invoice_id: Mapped[int] = mapped_column(ForeignKey("billing_invoices.id"), nullable=False, index=True)
        payer: Mapped[str] = mapped_column(String(120), nullable=False)
        claim_number: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
        status: Mapped[str] = mapped_column(String(40), default="submitted")
        submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        denial_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Charge = None  # type: ignore
    Invoice = None  # type: ignore
    InvoiceItem = None  # type: ignore
    Payment = None  # type: ignore
    InsuranceClaim = None  # type: ignore
