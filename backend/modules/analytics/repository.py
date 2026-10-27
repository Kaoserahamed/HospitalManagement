"""Analytics repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class AnalyticsRepository:
    def __init__(self) -> None:
        self._registries: dict[int, dict] = {}
        self._outcomes: dict[int, dict] = {}
        self._measures: dict[int, dict] = {}
        self._reports: dict[int, dict] = {}
        self._risks: dict[int, dict] = {}
        self._counters = {"registry": 0, "outcome": 0, "measure": 0, "report": 0, "risk": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_registry(self, data: dict) -> dict:
        rid = self._next("registry")
        record = {"id": rid, **data}
        self._registries[rid] = record
        return dict(record)

    def list_registries(self) -> list[dict]:
        return [dict(r) for r in self._registries.values()]

    def create_outcome(self, data: dict) -> dict:
        oid = self._next("outcome")
        record = {"id": oid, **data}
        self._outcomes[oid] = record
        return dict(record)

    def list_outcomes(self, patient_id: int | None = None, measure: str | None = None) -> list[dict]:
        items = list(self._outcomes.values())
        if patient_id is not None:
            items = [o for o in items if o.get("patient_id") == patient_id]
        if measure is not None:
            items = [o for o in items if o.get("measure") == measure]
        return [dict(o) for o in items]

    def create_measure(self, data: dict) -> dict:
        mid = self._next("measure")
        record = {"id": mid, **data}
        self._measures[mid] = record
        return dict(record)

    def list_measures(self) -> list[dict]:
        return [dict(m) for m in self._measures.values()]

    def get_measure(self, measure_id: int) -> Optional[dict]:
        record = self._measures.get(measure_id)
        return dict(record) if record else None

    def update_measure(self, measure_id: int, data: dict) -> dict:
        record = self._measures.get(measure_id)
        if record is None:
            raise KeyError(f"Measure {measure_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._measures[measure_id] = record
        return dict(record)

    def create_report(self, data: dict) -> dict:
        rid = self._next("report")
        record = {"id": rid, **data}
        self._reports[rid] = record
        return dict(record)

    def list_reports(self) -> list[dict]:
        return [dict(r) for r in self._reports.values()]

    def get_report(self, report_id: int) -> Optional[dict]:
        record = self._reports.get(report_id)
        return dict(record) if record else None

    def create_risk(self, data: dict) -> dict:
        rid = self._next("risk")
        record = {"id": rid, **data}
        self._risks[rid] = record
        return dict(record)

    def list_risks(self, patient_id: int | None = None, risk_level: str | None = None) -> list[dict]:
        items = list(self._risks.values())
        if patient_id is not None:
            items = [r for r in items if r.get("patient_id") == patient_id]
        if risk_level is not None:
            items = [r for r in items if r.get("risk_level") == risk_level]
        return [dict(r) for r in items]

    def count(self) -> int:
        return len(self._registries) + len(self._outcomes) + len(self._measures) + len(self._reports) + len(self._risks)

    def clear(self) -> None:
        self._registries.clear()
        self._outcomes.clear()
        self._measures.clear()
        self._reports.clear()
        self._risks.clear()
        for k in self._counters:
            self._counters[k] = 0
