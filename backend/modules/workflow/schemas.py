"""Workflow Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class WorkflowDefinitionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    version: str = "1.0"
    steps: str
    is_active: bool = True


class WorkflowDefinitionCreate(WorkflowDefinitionBase):
    pass


class WorkflowDefinitionRead(WorkflowDefinitionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class WorkflowInstanceBase(BaseModel):
    definition_id: int
    entity_type: str = Field(..., min_length=1, max_length=60)
    entity_id: int


class WorkflowInstanceCreate(WorkflowInstanceBase):
    pass


class WorkflowInstanceRead(WorkflowInstanceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "draft"
    current_step: int = 0
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class WorkflowStepBase(BaseModel):
    instance_id: int
    step_index: int
    name: str = Field(..., min_length=1, max_length=120)
    assigned_to: Optional[int] = None


class WorkflowStepCreate(WorkflowStepBase):
    pass


class WorkflowStepRead(WorkflowStepBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None


class WorkflowTransitionBase(BaseModel):
    instance_id: int
    from_step: int
    to_step: int
    action: str = Field(..., min_length=1, max_length=80)
    performed_by: Optional[int] = None
    notes: Optional[str] = None


class WorkflowTransitionCreate(WorkflowTransitionBase):
    pass


class WorkflowTransitionRead(WorkflowTransitionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    performed_at: Optional[datetime] = None


class WorkflowActionRequest(BaseModel):
    instance_id: int
    action: str
    performed_by: Optional[int] = None
    notes: Optional[str] = None
