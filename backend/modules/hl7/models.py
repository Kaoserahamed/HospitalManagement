"""HL7 v2 domain models and message handling."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class HL7MessageType(str, Enum):
    ADT = "ADT"
    ORU = "ORU"
    ORM = "ORM"
    ACK = "ACK"


class HL7Event(str, Enum):
    A01 = "A01"  # Admit
    A02 = "A02"  # Transfer
    A03 = "A03"  # Discharge
    A04 = "A04"  # Register
    A08 = "A08"  # Update
    R01 = "R01"  # Observation


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class HL7Message(Base):
        __tablename__ = "hl7_messages"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        message_type: Mapped[HL7MessageType] = mapped_column(SAEnum(HL7MessageType), nullable=False, index=True)
        event: Mapped[HL7Event] = mapped_column(SAEnum(HL7Event), nullable=False)
        raw_message: Mapped[str] = mapped_column(Text, nullable=False)
        parsed_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        status: Mapped[str] = mapped_column(String(20), default="received")
        patient_id: Mapped[Optional[int]] = mapped_column(ForeignKey("patients.id"), nullable=True)
        received_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "message_type": self.message_type.value if isinstance(self.message_type, HL7MessageType) else self.message_type,
                "event": self.event.value if isinstance(self.event, HL7Event) else self.event,
                "status": self.status,
                "patient_id": self.patient_id,
                "received_at": self.received_at.isoformat() if self.received_at else None,
                "processed_at": self.processed_at.isoformat() if self.processed_at else None,
                "error": self.error,
            }

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    HL7Message = None  # type: ignore
