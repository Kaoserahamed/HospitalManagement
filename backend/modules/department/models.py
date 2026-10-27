"""Department domain models."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Department(Base):
        __tablename__ = "departments"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        location: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        head_doctor_id: Mapped[Optional[int]] = mapped_column(ForeignKey("doctors.id"), nullable=True)
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "name": self.name,
                "description": self.description,
                "location": self.location,
                "head_doctor_id": self.head_doctor_id,
                "is_active": self.is_active,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            }

    class Room(Base):
        __tablename__ = "department_rooms"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
        name: Mapped[str] = mapped_column(String(80), nullable=False)
        capacity: Mapped[int] = mapped_column(Integer, default=1)
        equipment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        is_available: Mapped[bool] = mapped_column(default=True)

    class Equipment(Base):
        __tablename__ = "department_equipment"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        quantity: Mapped[int] = mapped_column(Integer, default=1)
        status: Mapped[str] = mapped_column(String(40), default="available")

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Department = None  # type: ignore
    Room = None  # type: ignore
    Equipment = None  # type: ignore
