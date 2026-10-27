"""Lab repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class LabRepository:
    def __init__(self) -> None:
        self._orders: dict[int, dict] = {}
        self._results: dict[int, dict] = {}
        self._panels: dict[int, dict] = {}
        self._counters = {"order": 0, "result": 0, "panel": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_order(self, data: dict) -> dict:
        oid = self._next("order")
        record = {"id": oid, **data, "status": data.get("status", "ordered")}
        self._orders[oid] = record
        return dict(record)

    def get_order(self, order_id: int) -> Optional[dict]:
        record = self._orders.get(order_id)
        return dict(record) if record else None

    def update_order(self, order_id: int, data: dict) -> dict:
        record = self._orders.get(order_id)
        if record is None:
            raise KeyError(f"Order {order_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._orders[order_id] = record
        return dict(record)

    def list_orders(self, params: PageParams, patient_id: int | None = None, status: str | None = None) -> PageResult:
        items = list(self._orders.values())
        if patient_id is not None:
            items = [o for o in items if o.get("patient_id") == patient_id]
        if status is not None:
            items = [o for o in items if o.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_result(self, data: dict) -> dict:
        rid = self._next("result")
        record = {"id": rid, **data}
        self._results[rid] = record
        return dict(record)

    def list_results(self, order_id: int) -> list[dict]:
        return [dict(r) for r in self._results.values() if r.get("order_id") == order_id]

    def create_panel(self, data: dict) -> dict:
        pid = self._next("panel")
        record = {"id": pid, **data}
        self._panels[pid] = record
        return dict(record)

    def list_panels(self) -> list[dict]:
        return [dict(p) for p in self._panels.values()]

    def count_orders(self) -> int:
        return len(self._orders)

    def clear(self) -> None:
        self._orders.clear()
        self._results.clear()
        self._panels.clear()
        for k in self._counters:
            self._counters[k] = 0
