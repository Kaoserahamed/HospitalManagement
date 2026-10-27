"""Rules engine domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class RuleType(str, Enum):
    VALIDATION = "validation"
    CALCULATION = "calculation"
    DECISION = "decision"
    TRANSFORMATION = "transformation"


class RuleStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    DISABLED = "disabled"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Rule(Base):
        __tablename__ = "rules_engine_rules"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        rule_type: Mapped[RuleType] = mapped_column(SAEnum(RuleType), nullable=False)
        condition: Mapped[str] = mapped_column(Text, nullable=False)
        action: Mapped[str] = mapped_column(Text, nullable=False)
        priority: Mapped[int] = mapped_column(Integer, default=0)
        status: Mapped[RuleStatus] = mapped_column(SAEnum(RuleStatus), default=RuleStatus.DRAFT)
        version: Mapped[str] = mapped_column(String(20), default="1.0")
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class RuleExecution(Base):
        __tablename__ = "rules_engine_executions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        rule_id: Mapped[int] = mapped_column(ForeignKey("rules_engine_rules.id"), nullable=False, index=True)
        input_data: Mapped[str] = mapped_column(Text, nullable=False)
        output_data: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        result: Mapped[str] = mapped_column(String(20), nullable=False)
        executed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    class RuleSet(Base):
        __tablename__ = "rules_engine_sets"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        rule_ids: Mapped[str] = mapped_column(Text, nullable=False)  # comma-separated
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Rule = None  # type: ignore
    RuleExecution = None  # type: ignore
    RuleSet = None  # type: ignore
