"""Insurance repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class InsuranceRepository:
    def __init__(self) -> None:
        self._plans: dict[int, dict] = {}
        self._patient_insurance: dict[int, dict] = {}
        self._claims: dict[int, dict] = {}
        self._appeals: dict[int, dict] = {}
        self._counters = {"plan": 0, "pi": 0, "claim": 0, "appeal": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_plan(self, data: dict) -> dict:
        pid = self._next("plan")
        record = {"id": pid, **data}
        self._plans[pid] = record
        return dict(record)

    def get_plan(self, plan_id: int) -> Optional[dict]:
        record = self._plans.get(plan_id)
        return dict(record) if record else None

    def list_plans(self) -> list[dict]:
        return [dict(p) for p in self._plans.values()]

    def create_patient_insurance(self, data: dict) -> dict:
        piid = self._next("pi")
        record = {"id": piid, **data}
        self._patient_insurance[piid] = record
        return dict(record)

    def get_patient_insurance(self, patient_id: int) -> Optional[dict]:
        for record in self._patient_insurance.values():
            if record.get("patient_id") == patient_id:
                return dict(record)
        return None

    def create_claim(self, data: dict) -> dict:
        cid = self._next("claim")
        record = {"id": cid, **data, "status": data.get("status", "submitted")}
        self._claims[cid] = record
        return dict(record)

    def get_claim(self, claim_id: int) -> Optional[dict]:
        record = self._claims.get(claim_id)
        return dict(record) if record else None

    def update_claim(self, claim_id: int, data: dict) -> dict:
        record = self._claims.get(claim_id)
        if record is None:
            raise KeyError(f"Claim {claim_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._claims[claim_id] = record
        return dict(record)

    def list_claims(self, params: PageParams, plan_id: int | None = None, status: str | None = None) -> PageResult:
        items = list(self._claims.values())
        if plan_id is not None:
            items = [c for c in items if c.get("plan_id") == plan_id]
        if status is not None:
            items = [c for c in items if c.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_appeal(self, data: dict) -> dict:
        aid = self._next("appeal")
        record = {"id": aid, **data, "status": "pending"}
        self._appeals[aid] = record
        return dict(record)

    def list_appeals(self, claim_id: int | None = None) -> list[dict]:
        items = list(self._appeals.values())
        if claim_id is not None:
            items = [a for a in items if a.get("claim_id") == claim_id]
        return [dict(a) for a in items]

    def count_claims(self) -> int:
        return len(self._claims)

    def clear(self) -> None:
        self._plans.clear()
        self._patient_insurance.clear()
        self._claims.clear()
        self._appeals.clear()
        for k in self._counters:
            self._counters[k] = 0
