"""Feature flags domain models."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class FeatureFlag(Base):
        __tablename__ = "feature_flags"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        key: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        enabled: Mapped[bool] = mapped_column(Boolean, default=False)
        rollout_percentage: Mapped[int] = mapped_column(Integer, default=0)
        target_roles: Mapped[Optional[str]] = mapped_column(String(240), nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "key": self.key,
                "name": self.name,
                "description": self.description,
                "enabled": self.enabled,
                "rollout_percentage": self.rollout_percentage,
                "target_roles": self.target_roles,
            }

    class FeatureFlagOverride(Base):
        __tablename__ = "feature_flag_overrides"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        flag_id: Mapped[int] = mapped_column(ForeignKey("feature_flags.id"), nullable=False, index=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
        enabled: Mapped[bool] = mapped_column(Boolean, nullable=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    FeatureFlag = None  # type: ignore
    FeatureFlagOverride = None  # type: ignore
