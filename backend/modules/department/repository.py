"""Department repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.errors import NotFoundError
from backend.shared.pagination import PageParams, PageResult, paginate


class DepartmentRepository:
    def __init__(self) -> None:
        self._store: dict[int, dict] = {}
        self._rooms: dict[int, dict] = {}
        self._equipment: dict[int, dict] = {}
        self._counter: int = 0
        self._room_counter: int = 0
        self._equip_counter: int = 0

    def _next_id(self) -> int:
        self._counter += 1
        return self._counter

    def create(self, data: dict) -> dict:
        did = self._next_id()
        record = {"id": did, **data, "is_active": data.get("is_active", True)}
        self._store[did] = record
        return dict(record)

    def get(self, department_id: int) -> Optional[dict]:
        record = self._store.get(department_id)
        return dict(record) if record else None

    def get_or_raise(self, department_id: int) -> dict:
        record = self.get(department_id)
        if record is None:
            raise NotFoundError("Department", department_id)
        return record

    def update(self, department_id: int, data: dict) -> dict:
        record = self.get_or_raise(department_id)
        record.update({k: v for k, v in data.items() if v is not None})
        self._store[department_id] = record
        return dict(record)

    def delete(self, department_id: int) -> bool:
        return self._store.pop(department_id, None) is not None

    def list(self, params: PageParams, search: str | None = None, active_only: bool = False) -> PageResult:
        items = list(self._store.values())
        if search:
            q = search.lower()
            items = [d for d in items if q in d.get("name", "").lower()]
        if active_only:
            items = [d for d in items if d.get("is_active")]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def find_by_name(self, name: str) -> Optional[dict]:
        for record in self._store.values():
            if record.get("name", "").lower() == name.lower():
                return dict(record)
        return None

    def create_room(self, data: dict) -> dict:
        rid = self._room_counter + 1
        self._room_counter = rid
        record = {"id": rid, **data, "is_available": True}
        self._rooms[rid] = record
        return dict(record)

    def list_rooms(self, department_id: int | None = None) -> list[dict]:
        items = list(self._rooms.values())
        if department_id is not None:
            items = [r for r in items if r.get("department_id") == department_id]
        return [dict(r) for r in items]

    def create_equipment(self, data: dict) -> dict:
        eid = self._equip_counter + 1
        self._equip_counter = eid
        record = {"id": eid, **data}
        self._equipment[eid] = record
        return dict(record)

    def list_equipment(self, department_id: int | None = None) -> list[dict]:
        items = list(self._equipment.values())
        if department_id is not None:
            items = [e for e in items if e.get("department_id") == department_id]
        return [dict(e) for e in items]

    def count(self) -> int:
        return len(self._store)

    def clear(self) -> None:
        self._store.clear()
        self._rooms.clear()
        self._equipment.clear()
        self._counter = 0
        self._room_counter = 0
        self._equip_counter = 0
