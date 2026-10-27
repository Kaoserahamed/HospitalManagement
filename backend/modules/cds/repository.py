"""CDS repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class CDSRepository:
    def __init__(self) -> None:
        self._rules: dict[int, dict] = {}
        self._alerts: dict[int, dict] = {}
        self._dose_ranges: dict[int, dict] = {}
        self._counters = {"rule": 0, "alert": 0, "dose": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_rule(self, data: dict) -> dict:
        rid = self._next("rule")
        record = {"id": rid, **data, "is_active": data.get("is_active", True)}
        self._rules[rid] = record
        return dict(record)

    def get_rule(self, rule_id: int) -> Optional[dict]:
        record = self._rules.get(rule_id)
        return dict(record) if record else None

    def list_rules(self, rule_type: str | None = None, active_only: bool = False) -> list[dict]:
        items = list(self._rules.values())
        if rule_type is not None:
            items = [r for r in items if r.get("rule_type") == rule_type]
        if active_only:
            items = [r for r in items if r.get("is_active")]
        return [dict(r) for r in items]

    def create_alert(self, data: dict) -> dict:
        aid = self._next("alert")
        record = {"id": aid, **data, "acknowledged": False}
        self._alerts[aid] = record
        return dict(record)

    def get_alert(self, alert_id: int) -> Optional[dict]:
        record = self._alerts.get(alert_id)
        return dict(record) if record else None

    def list_alerts(self, patient_id: int | None = None, acknowledged: bool | None = None) -> list[dict]:
        items = list(self._alerts.values())
        if patient_id is not None:
            items = [a for a in items if a.get("patient_id") == patient_id]
        if acknowledged is not None:
            items = [a for a in items if a.get("acknowledged") == acknowledged]
        return [dict(a) for a in items]

    def acknowledge_alert(self, alert_id: int, acknowledged_by: int | None = None) -> dict:
        record = self._alerts.get(alert_id)
        if record is None:
            raise KeyError(f"Alert {alert_id} not found")
        record["acknowledged"] = True
        record["acknowledged_by"] = acknowledged_by
        self._alerts[alert_id] = record
        return dict(record)

    def create_dose_range(self, data: dict) -> dict:
        did = self._next("dose")
        record = {"id": did, **data}
        self._dose_ranges[did] = record
        return dict(record)

    def get_dose_range(self, medication: str) -> list[dict]:
        return [dict(d) for d in self._dose_ranges.values() if d.get("medication", "").lower() == medication.lower()]

    def clear(self) -> None:
        self._rules.clear()
        self._alerts.clear()
        self._dose_ranges.clear()
        for k in self._counters:
            self._counters[k] = 0
