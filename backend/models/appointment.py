import enum
from datetime import datetime
from uuid import uuid4
from sqlalchemy import String, ForeignKey, DateTime, Text, Enum, Date, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from core.database import Base

if TYPE_CHECKING:
    from models.user import User
    from models.department import Department
    from models.patient import Patient


class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    department_id: Mapped[str] = mapped_column(String(36), ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False, index=True)
    appointment_date: Mapped[datetime.date] = mapped_column(Date, nullable=False, index=True)
    appointment_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus, values_callable=lambda obj: [e.value for e in obj]), 
        default=AppointmentStatus.SCHEDULED,
        index=True,
        nullable=False
    )
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    patient: Mapped["Patient"] = relationship("Patient")
    doctor: Mapped["User"] = relationship("User", foreign_keys=[doctor_id])
    department: Mapped["Department"] = relationship("Department")
