"""Care coordination repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class CareRepository:
    def __init__(self) -> None:
        self._teams: dict[int, dict] = {}
        self._members: dict[int, dict] = {}
        self._tasks: dict[int, dict] = {}
        self._handoffs: dict[int, dict] = {}
        self._discharge: dict[int, dict] = {}
        self._counters = {"team": 0, "member": 0, "task": 0, "handoff": 0, "discharge": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_team(self, data: dict) -> dict:
        tid = self._next("team")
        record = {"id": tid, **data}
        self._teams[tid] = record
        return dict(record)

    def get_team(self, team_id: int) -> Optional[dict]:
        record = self._teams.get(team_id)
        return dict(record) if record else None

    def list_teams(self, patient_id: int | None = None) -> list[dict]:
        items = list(self._teams.values())
        if patient_id is not None:
            items = [t for t in items if t.get("patient_id") == patient_id]
        return [dict(t) for t in items]

    def add_member(self, data: dict) -> dict:
        mid = self._next("member")
        record = {"id": mid, **data}
        self._members[mid] = record
        return dict(record)

    def list_members(self, care_team_id: int) -> list[dict]:
        return [dict(m) for m in self._members.values() if m.get("care_team_id") == care_team_id]

    def create_task(self, data: dict) -> dict:
        tid = self._next("task")
        record = {"id": tid, **data, "status": data.get("status", "open")}
        self._tasks[tid] = record
        return dict(record)

    def get_task(self, task_id: int) -> Optional[dict]:
        record = self._tasks.get(task_id)
        return dict(record) if record else None

    def update_task(self, task_id: int, data: dict) -> dict:
        record = self._tasks.get(task_id)
        if record is None:
            raise KeyError(f"Task {task_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._tasks[task_id] = record
        return dict(record)

    def list_tasks(self, params: PageParams, patient_id: int | None = None, assigned_to: int | None = None, status: str | None = None) -> PageResult:
        items = list(self._tasks.values())
        if patient_id is not None:
            items = [t for t in items if t.get("patient_id") == patient_id]
        if assigned_to is not None:
            items = [t for t in items if t.get("assigned_to") == assigned_to]
        if status is not None:
            items = [t for t in items if t.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_handoff(self, data: dict) -> dict:
        hid = self._next("handoff")
        record = {"id": hid, **data, "status": data.get("status", "pending")}
        self._handoffs[hid] = record
        return dict(record)

    def get_handoff(self, handoff_id: int) -> Optional[dict]:
        record = self._handoffs.get(handoff_id)
        return dict(record) if record else None

    def update_handoff(self, handoff_id: int, data: dict) -> dict:
        record = self._handoffs.get(handoff_id)
        if record is None:
            raise KeyError(f"Handoff {handoff_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._handoffs[handoff_id] = record
        return dict(record)

    def list_handoffs(self, patient_id: int | None = None, to_user: int | None = None) -> list[dict]:
        items = list(self._handoffs.values())
        if patient_id is not None:
            items = [h for h in items if h.get("patient_id") == patient_id]
        if to_user is not None:
            items = [h for h in items if h.get("to_user") == to_user]
        return [dict(h) for h in items]

    def create_discharge_plan(self, data: dict) -> dict:
        did = self._next("discharge")
        record = {"id": did, **data}
        self._discharge[did] = record
        return dict(record)

    def get_discharge_plan(self, plan_id: int) -> Optional[dict]:
        record = self._discharge.get(plan_id)
        return dict(record) if record else None

    def list_discharge_plans(self, patient_id: int | None = None) -> list[dict]:
        items = list(self._discharge.values())
        if patient_id is not None:
            items = [d for d in items if d.get("patient_id") == patient_id]
        return [dict(d) for d in items]

    def clear(self) -> None:
        self._teams.clear()
        self._members.clear()
        self._tasks.clear()
        self._handoffs.clear()
        self._discharge.clear()
        for k in self._counters:
            self._counters[k] = 0
