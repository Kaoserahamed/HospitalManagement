"""Integration adapters domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class AdapterType(str, Enum):
    FHIR = "fhir"
    HL7 = "hl7"
    PHARMACY = "pharmacy"
    BILLING = "billing"
    IDENTITY = "identity"
    LAB = "lab"


class AdapterStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class IntegrationAdapter(Base):
        __tablename__ = "integration_adapters"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        adapter_type: Mapped[AdapterType] = mapped_column(SAEnum(AdapterType), nullable=False)
        endpoint: Mapped[str] = mapped_column(String(500), nullable=False)
        credentials: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        status: Mapped[AdapterStatus] = mapped_column(SAEnum(AdapterStatus), default=AdapterStatus.ACTIVE)
        last_sync: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class SyncLog(Base):
        __tablename__ = "integration_sync_logs"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        adapter_id: Mapped[int] = mapped_column(ForeignKey("integration_adapters.id"), nullable=False, index=True)
        status: Mapped[str] = mapped_column(String(20), nullable=False)
        records_processed: Mapped[int] = mapped_column(Integer, default=0)
        records_failed: Mapped[int] = mapped_column(Integer, default=0)
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class Webhook(Base):
        __tablename__ = "integration_webhooks"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        url: Mapped[str] = mapped_column(String(500), nullable=False)
        events: Mapped[str] = mapped_column(Text, nullable=False)
        secret: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        is_active: Mapped[bool] = mapped_column(Boolean, default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class WebhookDelivery(Base):
        __tablename__ = "integration_webhook_deliveries"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        webhook_id: Mapped[int] = mapped_column(ForeignKey("integration_webhooks.id"), nullable=False, index=True)
        event: Mapped[str] = mapped_column(String(80), nullable=False)
        payload: Mapped[str] = mapped_column(Text, nullable=False)
        response_status: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        response_body: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        delivered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    IntegrationAdapter = None  # type: ignore
    SyncLog = None  # type: ignore
    Webhook = None  # type: ignore
    WebhookDelivery = None  # type: ignore
