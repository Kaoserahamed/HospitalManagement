"""Pharmacy repository."""

from __future__ import annotations

from datetime import date
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class PharmacyRepository:
    def __init__(self) -> None:
        self._meds: dict[int, dict] = {}
        self._stock: dict[int, dict] = {}
        self._lots: dict[int, dict] = {}
        self._suppliers: dict[int, dict] = {}
        self._dispenses: dict[int, dict] = {}
        self._interactions: dict[int, dict] = {}
        self._counters: dict[str, int] = {
            "med": 0, "stock": 0, "lot": 0, "supplier": 0, "dispense": 0, "interaction": 0
        }

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_medication(self, data: dict) -> dict:
        mid = self._next("med")
        record = {"id": mid, **data}
        self._meds[mid] = record
        return dict(record)

    def get_medication(self, medication_id: int) -> Optional[dict]:
        record = self._meds.get(medication_id)
        return dict(record) if record else None

    def list_medications(self, params: PageParams, search: str | None = None) -> PageResult:
        items = list(self._meds.values())
        if search:
            q = search.lower()
            items = [m for m in items if q in m.get("name", "").lower() or q in (m.get("generic_name") or "").lower()]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_stock(self, data: dict) -> dict:
        sid = self._next("stock")
        record = {"id": sid, **data}
        self._stock[sid] = record
        return dict(record)

    def get_stock(self, stock_id: int) -> Optional[dict]:
        record = self._stock.get(stock_id)
        return dict(record) if record else None

    def get_stock_by_medication(self, medication_id: int) -> Optional[dict]:
        for record in self._stock.values():
            if record.get("medication_id") == medication_id:
                return dict(record)
        return None

    def update_stock(self, stock_id: int, data: dict) -> dict:
        record = self._stock.get(stock_id)
        if record is None:
            raise KeyError(f"Stock {stock_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._stock[stock_id] = record
        return dict(record)

    def low_stock(self) -> list[dict]:
        result = []
        for record in self._stock.values():
            if record.get("quantity", 0) <= record.get("reorder_point", 0):
                result.append(dict(record))
        return result

    def create_lot(self, data: dict) -> dict:
        lid = self._next("lot")
        record = {"id": lid, **data}
        self._lots[lid] = record
        return dict(record)

    def list_lots(self, medication_id: int | None = None, expiring_before: date | None = None) -> list[dict]:
        items = list(self._lots.values())
        if medication_id is not None:
            items = [l for l in items if l.get("medication_id") == medication_id]
        if expiring_before is not None:
            items = [l for l in items if l.get("expiry_date") and l["expiry_date"] <= expiring_before]
        return [dict(l) for l in items]

    def create_supplier(self, data: dict) -> dict:
        sid = self._next("supplier")
        record = {"id": sid, **data}
        self._suppliers[sid] = record
        return dict(record)

    def list_suppliers(self) -> list[dict]:
        return [dict(s) for s in self._suppliers.values()]

    def create_dispense(self, data: dict) -> dict:
        did = self._next("dispense")
        record = {"id": did, **data}
        self._dispenses[did] = record
        return dict(record)

    def list_dispenses(self, prescription_id: int | None = None) -> list[dict]:
        items = list(self._dispenses.values())
        if prescription_id is not None:
            items = [d for d in items if d.get("prescription_id") == prescription_id]
        return [dict(d) for d in items]

    def add_interaction(self, data: dict) -> dict:
        iid = self._next("interaction")
        record = {"id": iid, **data}
        self._interactions[iid] = record
        return dict(record)

    def check_interaction(self, med_a: str, med_b: str) -> list[dict]:
        result = []
        for record in self._interactions.values():
            a, b = record.get("medication_a", "").lower(), record.get("medication_b", "").lower()
            if (a == med_a.lower() and b == med_b.lower()) or (a == med_b.lower() and b == med_a.lower()):
                result.append(dict(record))
        return result

    def count_medications(self) -> int:
        return len(self._meds)

    def clear(self) -> None:
        self._meds.clear()
        self._stock.clear()
        self._lots.clear()
        self._suppliers.clear()
        self._dispenses.clear()
        self._interactions.clear()
        for k in self._counters:
            self._counters[k] = 0
