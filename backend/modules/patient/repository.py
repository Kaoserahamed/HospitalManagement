"""Patient repository (data access)."""

from __future__ import annotations

from typing import Optional, Sequence

from backend.shared.errors import NotFoundError
from backend.shared.pagination import PageParams, PageResult, paginate


class PatientRepository:
    """In-memory/repository abstraction for patients.

    The real implementation uses SQLAlchemy sessions; this class defines the
    contract and provides an in-memory implementation for tests and prototyping.
    """

    def __init__(self) -> None:
        self._store: dict[int, dict] = {}
        self._counter: int = 0

    def _next_id(self) -> int:
        self._counter += 1
        return self._counter

    def create(self, data: dict) -> dict:
        pid = self._next_id()
        record = {"id": pid, **data}
        self._store[pid] = record
        return dict(record)

    def get(self, patient_id: int) -> Optional[dict]:
        record = self._store.get(patient_id)
        return dict(record) if record else None

    def get_or_raise(self, patient_id: int) -> dict:
        record = self.get(patient_id)
        if record is None:
            raise NotFoundError("Patient", patient_id)
        return record

    def update(self, patient_id: int, data: dict) -> dict:
        record = self.get_or_raise(patient_id)
        record.update({k: v for k, v in data.items() if v is not None})
        self._store[patient_id] = record
        return dict(record)

    def delete(self, patient_id: int) -> bool:
        if patient_id in self._store:
            del self._store[patient_id]
            return True
        return False

    def list(self, params: PageParams, search: str | None = None, status: str | None = None) -> PageResult:
        items = list(self._store.values())
        if search:
            q = search.lower()
            items = [p for p in items if q in p.get("first_name", "").lower() or q in p.get("last_name", "").lower()]
        if status:
            items = [p for p in items if p.get("status") == status]
        total = len(items)
        start = params.offset
        end = start + params.limit
        page_items = items[start:end]
        return paginate(page_items, params, total)

    def count(self) -> int:
        return len(self._store)

    def find_by_user(self, user_id: int) -> Optional[dict]:
        for record in self._store.values():
            if record.get("user_id") == user_id:
                return dict(record)
        return None

    def find_by_name(self, first: str, last: str) -> list[dict]:
        result = []
        for record in self._store.values():
            if record.get("first_name", "").lower() == first.lower() and record.get("last_name", "").lower() == last.lower():
                result.append(dict(record))
        return result

    def bulk_create(self, items: Sequence[dict]) -> list[dict]:
        return [self.create(item) for item in items]

    def clear(self) -> None:
        self._store.clear()
        self._counter = 0
