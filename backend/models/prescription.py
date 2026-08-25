from datetime import datetime, date
from uuid import uuid4
from sqlalchemy import String, DateTime, Date, Text, func, ForeignKey, CHAR
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class Prescription(Base):
    """Prescription model"""
    __tablename__ = "prescriptions"

    id: Mapped[str] = mapped_column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    appointment_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False, index=True)
    patient_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    diagnosis: Mapped[str] = mapped_column(Text, nullable=False)
    medications: Mapped[str] = mapped_column(Text, nullable=False)  # JSON string
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    follow_up_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
