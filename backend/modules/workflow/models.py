"""Workflow engine domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class WorkflowStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class StepStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SKIPPED = "skipped"
    FAILED = "failed"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class WorkflowDefinition(Base):
        __tablename__ = "workflow_definitions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        version: Mapped[str] = mapped_column(String(20), default="1.0")
        steps: Mapped[str] = mapped_column(Text, nullable=False)  # JSON list of steps
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class WorkflowInstance(Base):
        __tablename__ = "workflow_instances"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        definition_id: Mapped[int] = mapped_column(ForeignKey("workflow_definitions.id"), nullable=False, index=True)
        entity_type: Mapped[str] = mapped_column(String(60), nullable=False)
        entity_id: Mapped[int] = mapped_column(Integer, nullable=False)
        status: Mapped[WorkflowStatus] = mapped_column(SAEnum(WorkflowStatus), default=WorkflowStatus.DRAFT)
        current_step: Mapped[int] = mapped_column(Integer, default=0)
        started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class WorkflowStep(Base):
        __tablename__ = "workflow_steps"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        instance_id: Mapped[int] = mapped_column(ForeignKey("workflow_instances.id"), nullable=False, index=True)
        step_index: Mapped[int] = mapped_column(Integer, nullable=False)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        status: Mapped[StepStatus] = mapped_column(SAEnum(StepStatus), default=StepStatus.PENDING)
        assigned_to: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    class WorkflowTransition(Base):
        __tablename__ = "workflow_transitions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        instance_id: Mapped[int] = mapped_column(ForeignKey("workflow_instances.id"), nullable=False, index=True)
        from_step: Mapped[int] = mapped_column(Integer, nullable=False)
        to_step: Mapped[int] = mapped_column(Integer, nullable=False)
        action: Mapped[str] = mapped_column(String(80), nullable=False)
        performed_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        performed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    WorkflowDefinition = None  # type: ignore
    WorkflowInstance = None  # type: ignore
    WorkflowStep = None  # type: ignore
    WorkflowTransition = None  # type: ignore
