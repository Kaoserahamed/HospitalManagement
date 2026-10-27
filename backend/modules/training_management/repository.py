"""TrainingRecord repository."""

from __future__ import annotations

from backend.shared.pagination import PageParams, PageResult, paginate


class TrainingRecordRepository:
    def __init__(self) -> None:
        self._records: dict[int, dict] = {}
        self._counter: int = 0

    def _next(self) -> int:
        self._counter += 1
        return self._counter

    def create(self, data: dict) -> dict:
        rid = self._next()
        record = {
            "id": rid,
            **data,
            "status": data.get("status", "draft"),
            "is_active": data.get("is_active", True),
        }
        self._records[rid] = record
        return dict(record)

    def get(self, record_id: int) -> dict | None:
        record = self._records.get(record_id)
        return dict(record) if record else None

    def update(self, record_id: int, data: dict) -> dict:
        record = self._records.get(record_id)
        if record is None:
            raise KeyError(f"TrainingRecord {record_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._records[record_id] = record
        return dict(record)

    def delete(self, record_id: int) -> bool:
        return self._records.pop(record_id, None) is not None

    def list(
        self,
        params: PageParams,
        patient_id: int | None = None,
        status: str | None = None,
        priority: str | None = None,
        category: str | None = None,
        is_active: bool | None = None,
    ) -> PageResult:
        items = list(self._records.values())
        if patient_id is not None:
            items = [r for r in items if r.get("patient_id") == patient_id]
        if status is not None:
            items = [r for r in items if r.get("status") == status]
        if priority is not None:
            items = [r for r in items if r.get("priority") == priority]
        if category is not None:
            items = [r for r in items if r.get("category") == category]
        if is_active is not None:
            items = [r for r in items if r.get("is_active") == is_active]
        total = len(items)
        page_items = items[params.offset : params.offset + params.limit]
        return paginate(page_items, params, total)

    def list_all(self, patient_id: int | None = None, status: str | None = None) -> list[dict]:
        items = list(self._records.values())
        if patient_id is not None:
            items = [r for r in items if r.get("patient_id") == patient_id]
        if status is not None:
            items = [r for r in items if r.get("status") == status]
        return [dict(r) for r in items]

    def count(self) -> int:
        return len(self._records)

    def count_by_status(self, status: str) -> int:
        return sum(1 for r in self._records.values() if r.get("status") == status)

    def count_by_patient(self, patient_id: int) -> int:
        return sum(1 for r in self._records.values() if r.get("patient_id") == patient_id)

    def search(self, query: str) -> list[dict]:
        q = query.lower()
        return [
            dict(r)
            for r in self._records.values()
            if q in str(r.get("title", "")).lower() or q in str(r.get("description", "")).lower()
        ]

    def activate(self, record_id: int) -> dict:
        return self.update(record_id, {"is_active": True, "status": "active"})

    def deactivate(self, record_id: int) -> dict:
        return self.update(record_id, {"is_active": False, "status": "cancelled"})

    def complete(self, record_id: int, notes: str | None = None) -> dict:
        payload = {"status": "completed"}
        if notes:
            payload["notes"] = notes
        return self.update(record_id, payload)

    def cancel(self, record_id: int, reason: str | None = None) -> dict:
        payload = {"status": "cancelled"}
        if reason:
            payload["notes"] = reason
        return self.update(record_id, payload)

    def clear(self) -> None:
        self._records.clear()
        self._counter = 0
