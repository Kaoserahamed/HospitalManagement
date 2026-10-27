"""Security domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class MFAMethod(str, Enum):
    TOTP = "totp"
    SMS = "sms"
    EMAIL = "email"


class MFAStatus(str, Enum):
    DISABLED = "disabled"
    PENDING = "pending"
    ENABLED = "enabled"


class SSOProvider(str, Enum):
    SAML = "saml"
    OIDC = "oidc"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class MFAConfig(Base):
        __tablename__ = "security_mfa_configs"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True)
        method: Mapped[MFAMethod] = mapped_column(SAEnum(MFAMethod), default=MFAMethod.TOTP)
        status: Mapped[MFAStatus] = mapped_column(SAEnum(MFAStatus), default=MFAStatus.DISABLED)
        secret: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        backup_codes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        enabled_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class SSOLink(Base):
        __tablename__ = "security_sso_links"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
        provider: Mapped[SSOProvider] = mapped_column(SAEnum(SSOProvider), nullable=False)
        external_id: Mapped[str] = mapped_column(String(240), nullable=False)
        idp_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        linked_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class SecurityEvent(Base):
        __tablename__ = "security_events"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
        event_type: Mapped[str] = mapped_column(String(80), nullable=False)
        severity: Mapped[str] = mapped_column(String(20), default="info")
        ip_address: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
        user_agent: Mapped[Optional[str]] = mapped_column(String(240), nullable=True)
        details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        occurred_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class EncryptionKey(Base):
        __tablename__ = "security_encryption_keys"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        key_id: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
        algorithm: Mapped[str] = mapped_column(String(40), nullable=False)
        purpose: Mapped[str] = mapped_column(String(80), nullable=False)
        is_active: Mapped[bool] = mapped_column(Boolean, default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        rotated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    MFAConfig = None  # type: ignore
    SSOLink = None  # type: ignore
    SecurityEvent = None  # type: ignore
    EncryptionKey = None  # type: ignore
