"""Insurance domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class ClaimStatus(str, Enum):
    SUBMITTED = "submitted"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    DENIED = "denied"
    APPEALED = "appealed"
    PAID = "paid"


class PayerType(str, Enum):
    PRIVATE = "private"
    GOVERNMENT = "government"
    SELF_PAY = "self_pay"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class InsurancePlan(Base):
        __tablename__ = "insurance_plans"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        payer_type: Mapped[PayerType] = mapped_column(SAEnum(PayerType), default=PayerType.PRIVATE)
        coverage_details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class PatientInsurance(Base):
        __tablename__ = "insurance_patient"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        plan_id: Mapped[int] = mapped_column(ForeignKey("insurance_plans.id"), nullable=False)
        policy_number: Mapped[str] = mapped_column(String(120), nullable=False)
        group_number: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        effective_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        expiry_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class Claim(Base):
        __tablename__ = "insurance_claims"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        invoice_id: Mapped[int] = mapped_column(ForeignKey("billing_invoices.id"), nullable=False, index=True)
        plan_id: Mapped[int] = mapped_column(ForeignKey("insurance_plans.id"), nullable=False)
        claim_number: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
        status: Mapped[ClaimStatus] = mapped_column(SAEnum(ClaimStatus), default=ClaimStatus.SUBMITTED)
        amount_claimed: Mapped[float] = mapped_column(Float, nullable=False)
        amount_approved: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
        submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        denial_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    class Appeal(Base):
        __tablename__ = "insurance_appeals"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        claim_id: Mapped[int] = mapped_column(ForeignKey("insurance_claims.id"), nullable=False, index=True)
        reason: Mapped[str] = mapped_column(Text, nullable=False)
        status: Mapped[str] = mapped_column(String(40), default="pending")
        submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    InsurancePlan = None  # type: ignore
    PatientInsurance = None  # type: ignore
    Claim = None  # type: ignore
    Appeal = None  # type: ignore
