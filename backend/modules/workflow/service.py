"""Workflow service."""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import WorkflowRepository
from .schemas import WorkflowActionRequest, WorkflowDefinitionCreate, WorkflowInstanceCreate, WorkflowStepCreate


class WorkflowService:
    def __init__(self, repository: WorkflowRepository | None = None) -> None:
        self.repository = repository or WorkflowRepository()

    def create_definition(self, data: WorkflowDefinitionCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("steps"):
            raise ValidationError("steps are required")
        record = self.repository.create_definition(payload)
        default_bus.publish(DomainEvent(name="WorkflowDefinitionCreated", payload={"definition_id": record["id"]}))
        return record

    def get_definition(self, definition_id: int) -> dict:
        record = self.repository.get_definition(definition_id)
        if record is None:
            raise NotFoundError("WorkflowDefinition", definition_id)
        return record

    def list_definitions(self, active_only: bool = False) -> list[dict]:
        return self.repository.list_definitions(active_only=active_only)

    def start_instance(self, data: WorkflowInstanceCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        definition = self.get_definition(payload["definition_id"])
        steps = json.loads(definition.get("steps", "[]"))
        instance = self.repository.create_instance({**payload, "status": "active", "started_at": datetime.utcnow()})
        # create steps
        for idx, step in enumerate(steps):
            self.repository.create_step({"instance_id": instance["id"], "step_index": idx, "name": step.get("name", f"Step {idx + 1}"), "assigned_to": step.get("assigned_to")})
        default_bus.publish(DomainEvent(name="WorkflowStarted", payload={"instance_id": instance["id"]}))
        return self.get_instance(instance["id"])

    def get_instance(self, instance_id: int) -> dict:
        record = self.repository.get_instance(instance_id)
        if record is None:
            raise NotFoundError("WorkflowInstance", instance_id)
        record["steps"] = self.repository.list_steps(instance_id)
        record["transitions"] = self.repository.list_transitions(instance_id)
        return record

    def list_instances(self, params: PageParams, entity_type: str | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_instances(params, entity_type=entity_type, status=status)

    def advance(self, request: WorkflowActionRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        instance = self.get_instance(payload["instance_id"])
        if instance["status"] not in ("active", "draft"):
            raise ValidationError("Workflow not active")
        steps = instance.get("steps", [])
        current_idx = instance.get("current_step", 0)
        if current_idx >= len(steps):
            raise ValidationError("No more steps")
        # complete current step
        current_step = steps[current_idx]
        self.repository.update_step(current_step["id"], {"status": "completed", "completed_at": datetime.utcnow()})
        # transition
        next_idx = current_idx + 1
        if next_idx < len(steps):
            self.repository.update_step(steps[next_idx]["id"], {"status": "in_progress", "started_at": datetime.utcnow()})
            self.repository.update_instance(payload["instance_id"], {"current_step": next_idx})
            self.repository.create_transition({"instance_id": payload["instance_id"], "from_step": current_idx, "to_step": next_idx, "action": payload["action"], "performed_by": payload.get("performed_by"), "notes": payload.get("notes")})
            default_bus.publish(DomainEvent(name="WorkflowAdvanced", payload={"instance_id": payload["instance_id"], "step": next_idx}))
        else:
            self.repository.update_instance(payload["instance_id"], {"status": "completed", "completed_at": datetime.utcnow()})
            self.repository.create_transition({"instance_id": payload["instance_id"], "from_step": current_idx, "to_step": -1, "action": "complete", "performed_by": payload.get("performed_by"), "notes": payload.get("notes")})
            default_bus.publish(DomainEvent(name="WorkflowCompleted", payload={"instance_id": payload["instance_id"]}))
        return self.get_instance(payload["instance_id"])

    def skip_step(self, instance_id: int, step_index: int, performed_by: int | None = None) -> dict:
        instance = self.get_instance(instance_id)
        steps = instance.get("steps", [])
        if step_index >= len(steps):
            raise ValidationError("Invalid step index")
        self.repository.update_step(steps[step_index]["id"], {"status": "skipped", "completed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="WorkflowStepSkipped", payload={"instance_id": instance_id, "step": step_index}))
        return self.get_instance(instance_id)

    def fail_step(self, instance_id: int, step_index: int, notes: str | None = None) -> dict:
        instance = self.get_instance(instance_id)
        steps = instance.get("steps", [])
        if step_index >= len(steps):
            raise ValidationError("Invalid step index")
        self.repository.update_step(steps[step_index]["id"], {"status": "failed", "notes": notes})
        self.repository.update_instance(instance_id, {"status": "paused"})
        default_bus.publish(DomainEvent(name="WorkflowStepFailed", payload={"instance_id": instance_id, "step": step_index}))
        return self.get_instance(instance_id)

    def pause(self, instance_id: int) -> dict:
        record = self.repository.update_instance(instance_id, {"status": "paused"})
        default_bus.publish(DomainEvent(name="WorkflowPaused", payload={"instance_id": instance_id}))
        return record

    def resume(self, instance_id: int) -> dict:
        record = self.repository.update_instance(instance_id, {"status": "active"})
        default_bus.publish(DomainEvent(name="WorkflowResumed", payload={"instance_id": instance_id}))
        return record

    def cancel(self, instance_id: int) -> dict:
        record = self.repository.update_instance(instance_id, {"status": "cancelled", "completed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="WorkflowCancelled", payload={"instance_id": instance_id}))
        return record

    def progress(self, instance_id: int) -> dict:
        instance = self.get_instance(instance_id)
        steps = instance.get("steps", [])
        total = len(steps)
        completed = sum(1 for s in steps if s.get("status") in ("completed", "skipped"))
        return {"instance_id": instance_id, "total_steps": total, "completed_steps": completed, "progress_percent": round(completed / total * 100, 1) if total else 0}

    def history(self, instance_id: int) -> list[dict]:
        return self.repository.list_transitions(instance_id)

    def clear(self) -> None:
        self.repository.clear()
