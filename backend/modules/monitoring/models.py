"""Remote patient monitoring models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class VitalType(str, Enum):
    BLOOD_PRESSURE = "blood_pressure"
    HEART_RATE = "heart_rate"
    TEMPERATURE = "temperature"
    OXYGEN_SATURATION = "oxygen_saturation"
    GLUCOSE = "glucose"
    WEIGHT = "weight"


class AlertSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Device(Base):
        __tablename__ = "monitoring_devices"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        device_type: Mapped[str] = mapped_column(String(60), nullable=False)
        serial_number: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
        is_active: Mapped[bool] = mapped_column(default=True)
        registered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class VitalReading(Base):
        __tablename__ = "monitoring_readings"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        device_id: Mapped[Optional[int]] = mapped_column(ForeignKey("monitoring_devices.id"), nullable=True)
        vital_type: Mapped[VitalType] = mapped_column(SAEnum(VitalType), nullable=False)
        value: Mapped[float] = mapped_column(Float, nullable=False)
        unit: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    class AlertThreshold(Base):
        __tablename__ = "monitoring_thresholds"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        vital_type: Mapped[VitalType] = mapped_column(SAEnum(VitalType), nullable=False)
        min_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
        max_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
        severity: Mapped[AlertSeverity] = mapped_column(SAEnum(AlertSeverity), default=AlertSeverity.WARNING)

    class MonitoringAlert(Base):
        __tablename__ = "monitoring_alerts"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        vital_type: Mapped[VitalType] = mapped_column(SAEnum(VitalType), nullable=False)
        value: Mapped[float] = mapped_column(Float, nullable=False)
        severity: Mapped[AlertSeverity] = mapped_column(SAEnum(AlertSeverity), default=AlertSeverity.WARNING)
        message: Mapped[str] = mapped_column(Text, nullable=False)
        acknowledged: Mapped[bool] = mapped_column(Boolean, default=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Device = None  # type: ignore
    VitalReading = None  # type: ignore
    AlertThreshold = None  # type: ignore
    MonitoringAlert = None  # type: ignore
