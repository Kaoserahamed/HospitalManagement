"""Department service."""

from __future__ import annotations

from typing import Any, Optional

from backend.shared.errors import ConflictError, NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import DepartmentRepository
from .schemas import DepartmentCreate, DepartmentUpdate, RoomCreate, EquipmentCreate


class DepartmentService:
    def __init__(self, repository: DepartmentRepository | None = None) -> None:
        self.repository = repository or DepartmentRepository()

    def create(self, data: DepartmentCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.find_by_name(payload.get("name", "")):
            raise ConflictError("Department with this name already exists")
        record = self.repository.create(payload)
        default_bus.publish(DomainEvent(name="DepartmentCreated", payload={"department_id": record["id"]}))
        return record

    def get(self, department_id: int) -> dict:
        return self.repository.get_or_raise(department_id)

    def update(self, department_id: int, data: DepartmentUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        if "name" in payload and payload["name"]:
            existing = self.repository.find_by_name(payload["name"])
            if existing and existing["id"] != department_id:
                raise ConflictError("Department name already in use")
        record = self.repository.update(department_id, payload)
        default_bus.publish(DomainEvent(name="DepartmentUpdated", payload={"department_id": department_id}))
        return record

    def delete(self, department_id: int) -> bool:
        if not self.repository.delete(department_id):
            raise NotFoundError("Department", department_id)
        default_bus.publish(DomainEvent(name="DepartmentDeleted", payload={"department_id": department_id}))
        return True

    def list(self, params: PageParams, search: str | None = None, active_only: bool = False) -> PageResult:
        return self.repository.list(params, search=search, active_only=active_only)

    def add_room(self, data: RoomCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not self.repository.get(payload["department_id"]):
            raise NotFoundError("Department", payload["department_id"])
        return self.repository.create_room(payload)

    def list_rooms(self, department_id: int | None = None) -> list[dict]:
        return self.repository.list_rooms(department_id=department_id)

    def add_equipment(self, data: EquipmentCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not self.repository.get(payload["department_id"]):
            raise NotFoundError("Department", payload["department_id"])
        return self.repository.create_equipment(payload)

    def list_equipment(self, department_id: int | None = None) -> list[dict]:
        return self.repository.list_equipment(department_id=department_id)

    def assign_head(self, department_id: int, doctor_id: int) -> dict:
        return self.update(department_id, {"head_doctor_id": doctor_id})

    def deactivate(self, department_id: int) -> dict:
        return self.update(department_id, {"is_active": False})

    def activate(self, department_id: int) -> dict:
        return self.update(department_id, {"is_active": True})

    def count(self) -> int:
        return self.repository.count()
