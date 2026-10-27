"""Pharmacy service."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import PharmacyRepository
from .schemas import (
    DispenseCreate,
    InteractionCheck,
    LotCreate,
    MedicationCreate,
    StockCreate,
    SupplierCreate,
)


class PharmacyService:
    def __init__(self, repository: PharmacyRepository | None = None) -> None:
        self.repository = repository or PharmacyRepository()

    def create_medication(self, data: MedicationCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("name"):
            raise ValidationError("medication name is required")
        record = self.repository.create_medication(payload)
        default_bus.publish(DomainEvent(name="MedicationCreated", payload={"medication_id": record["id"]}))
        return record

    def get_medication(self, medication_id: int) -> dict:
        record = self.repository.get_medication(medication_id)
        if record is None:
            raise NotFoundError("Medication", medication_id)
        return record

    def list_medications(self, params: PageParams, search: str | None = None) -> PageResult:
        return self.repository.list_medications(params, search=search)

    def create_stock(self, data: StockCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_medication(payload["medication_id"]) is None:
            raise NotFoundError("Medication", payload["medication_id"])
        record = self.repository.create_stock(payload)
        default_bus.publish(DomainEvent(name="StockCreated", payload={"stock_id": record["id"]}))
        return record

    def get_stock(self, stock_id: int) -> dict:
        record = self.repository.get_stock(stock_id)
        if record is None:
            raise NotFoundError("Stock", stock_id)
        return record

    def update_stock(self, stock_id: int, quantity: int) -> dict:
        if quantity < 0:
            raise ValidationError("quantity cannot be negative")
        return self.repository.update_stock(stock_id, {"quantity": quantity})

    def low_stock_alerts(self) -> list[dict]:
        return self.repository.low_stock()

    def create_lot(self, data: LotCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_medication(payload["medication_id"]) is None:
            raise NotFoundError("Medication", payload["medication_id"])
        record = self.repository.create_lot(payload)
        default_bus.publish(DomainEvent(name="LotReceived", payload={"lot_id": record["id"]}))
        return record

    def list_lots(self, medication_id: int | None = None, expiring_within_days: int | None = None) -> list[dict]:
        expiry = None
        if expiring_within_days is not None:
            expiry = date.today() + timedelta(days=expiring_within_days)
        return self.repository.list_lots(medication_id=medication_id, expiring_before=expiry)

    def create_supplier(self, data: SupplierCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_supplier(payload)
        default_bus.publish(DomainEvent(name="SupplierCreated", payload={"supplier_id": record["id"]}))
        return record

    def list_suppliers(self) -> list[dict]:
        return self.repository.list_suppliers()

    def dispense(self, data: DispenseCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        medication = self.repository.get_medication(payload["medication_id"])
        if medication is None:
            raise NotFoundError("Medication", payload["medication_id"])
        stock = self.repository.get_stock_by_medication(payload["medication_id"])
        if stock is None or stock.get("quantity", 0) < payload["quantity"]:
            raise ValidationError("insufficient stock")
        # decrement stock
        new_qty = stock["quantity"] - payload["quantity"]
        self.repository.update_stock(stock["id"], {"quantity": new_qty})
        record = self.repository.create_dispense(payload)
        default_bus.publish(DomainEvent(name="DispenseCompleted", payload={"dispense_id": record["id"]}))
        return record

    def list_dispenses(self, prescription_id: int | None = None) -> list[dict]:
        return self.repository.list_dispenses(prescription_id=prescription_id)

    def add_interaction(self, med_a: str, med_b: str, severity: str, description: str) -> dict:
        return self.repository.add_interaction({
            "medication_a": med_a,
            "medication_b": med_b,
            "severity": severity,
            "description": description,
        })

    def check_interaction(self, check: InteractionCheck | dict) -> dict:
        payload = check.model_dump() if hasattr(check, "model_dump") else dict(check)
        interactions = self.repository.check_interaction(payload["medication_a"], payload["medication_b"])
        return {"has_interaction": bool(interactions), "interactions": interactions}

    def check_allergy_conflict(self, medication: str, allergies: list[str]) -> dict:
        conflicts = [a for a in allergies if a.lower() in medication.lower()]
        return {"has_conflict": bool(conflicts), "conflicts": conflicts}

    def expiring_lots(self, days: int = 30) -> list[dict]:
        return self.list_lots(expiring_within_days=days)

    def count_medications(self) -> int:
        return self.repository.count_medications()
