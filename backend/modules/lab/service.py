"""Lab service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import LabRepository
from .schemas import LabOrderCreate, LabOrderUpdate, LabPanelCreate, LabResultCreate


class LabService:
    def __init__(self, repository: LabRepository | None = None) -> None:
        self.repository = repository or LabRepository()

    def create_order(self, data: LabOrderCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("test_code") or not payload.get("test_name"):
            raise ValidationError("test_code and test_name are required")
        record = self.repository.create_order(payload)
        default_bus.publish(DomainEvent(name="LabOrderCreated", payload={"order_id": record["id"]}))
        return record

    def get_order(self, order_id: int) -> dict:
        record = self.repository.get_order(order_id)
        if record is None:
            raise NotFoundError("LabOrder", order_id)
        record["results"] = self.repository.list_results(order_id)
        return record

    def update_order(self, order_id: int, data: LabOrderUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update_order(order_id, payload)
        default_bus.publish(DomainEvent(name="LabOrderUpdated", payload={"order_id": order_id}))
        return record

    def collect_sample(self, order_id: int) -> dict:
        return self.update_order(order_id, {"status": "collected", "collected_at": datetime.utcnow()})

    def start_processing(self, order_id: int) -> dict:
        return self.update_order(order_id, {"status": "in_progress"})

    def cancel_order(self, order_id: int, reason: str | None = None) -> dict:
        payload = {"status": "cancelled"}
        if reason:
            payload["notes"] = reason
        return self.update_order(order_id, payload)

    def list_orders(self, params: PageParams, patient_id: int | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_orders(params, patient_id=patient_id, status=status)

    def add_result(self, data: LabResultCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_order(payload["order_id"]) is None:
            raise NotFoundError("LabOrder", payload["order_id"])
        record = self.repository.create_result(payload)
        self.repository.update_order(payload["order_id"], {"status": "resulted", "resulted_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="LabResultAdded", payload={"result_id": record["id"]}))
        return record

    def list_results(self, order_id: int) -> list[dict]:
        return self.repository.list_results(order_id)

    def create_panel(self, data: LabPanelCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_panel(payload)
        default_bus.publish(DomainEvent(name="LabPanelCreated", payload={"panel_id": record["id"]}))
        return record

    def list_panels(self) -> list[dict]:
        return self.repository.list_panels()

    def order_panel(self, panel_id: int, patient_id: int, ordering_provider: int, encounter_id: int | None = None) -> list[dict]:
        panels = self.repository.list_panels()
        panel = next((p for p in panels if p["id"] == panel_id), None)
        if panel is None:
            raise NotFoundError("LabPanel", panel_id)
        tests = [t.strip() for t in panel["tests"].split(",") if t.strip()]
        orders = []
        for test in tests:
            order = self.create_order({
                "patient_id": patient_id,
                "encounter_id": encounter_id,
                "ordering_provider": ordering_provider,
                "test_code": test,
                "test_name": test,
                "priority": "routine",
            })
            orders.append(order)
        return orders

    def abnormal_results(self, patient_id: int) -> list[dict]:
        result = []
        orders = self.repository.list_orders(PageParams(page=1, per_page=1000), patient_id=patient_id)
        for order in orders.items:
            for r in self.repository.list_results(order["id"]):
                if r.get("abnormal"):
                    result.append(r)
        return result

    def count_orders(self) -> int:
        return self.repository.count_orders()

    def clear(self) -> None:
        self.repository.clear()
