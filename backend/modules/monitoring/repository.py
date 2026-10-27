"""Monitoring repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class MonitoringRepository:
    def __init__(self) -> None:
        self._devices: dict[int, dict] = {}
        self._readings: dict[int, dict] = {}
        self._thresholds: dict[int, dict] = {}
        self._alerts: dict[int, dict] = {}
        self._counters = {"device": 0, "reading": 0, "threshold": 0, "alert": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_device(self, data: dict) -> dict:
        did = self._next("device")
        record = {"id": did, **data, "is_active": data.get("is_active", True)}
        self._devices[did] = record
        return dict(record)

    def get_device(self, device_id: int) -> Optional[dict]:
        record = self._devices.get(device_id)
        return dict(record) if record else None

    def list_devices(self, patient_id: int | None = None) -> list[dict]:
        items = list(self._devices.values())
        if patient_id is not None:
            items = [d for d in items if d.get("patient_id") == patient_id]
        return [dict(d) for d in items]

    def create_reading(self, data: dict) -> dict:
        rid = self._next("reading")
        record = {"id": rid, **data}
        self._readings[rid] = record
        return dict(record)

    def list_readings(self, patient_id: int | None = None, vital_type: str | None = None, limit: int = 100) -> list[dict]:
        items = list(self._readings.values())
        if patient_id is not None:
            items = [r for r in items if r.get("patient_id") == patient_id]
        if vital_type is not None:
            items = [r for r in items if r.get("vital_type") == vital_type]
        items.sort(key=lambda x: x.get("recorded_at") or "", reverse=True)
        return [dict(r) for r in items[:limit]]

    def create_threshold(self, data: dict) -> dict:
        tid = self._next("threshold")
        record = {"id": tid, **data}
        self._thresholds[tid] = record
        return dict(record)

    def list_thresholds(self) -> list[dict]:
        return [dict(t) for t in self._thresholds.values()]

    def get_threshold(self, vital_type: str) -> Optional[dict]:
        for record in self._thresholds.values():
            if record.get("vital_type") == vital_type:
                return dict(record)
        return None

    def create_alert(self, data: dict) -> dict:
        aid = self._next("alert")
        record = {"id": aid, **data, "acknowledged": False}
        self._alerts[aid] = record
        return dict(record)

    def list_alerts(self, patient_id: int | None = None, acknowledged: bool | None = None) -> list[dict]:
        items = list(self._alerts.values())
        if patient_id is not None:
            items = [a for a in items if a.get("patient_id") == patient_id]
        if acknowledged is not None:
            items = [a for a in items if a.get("acknowledged") == acknowledged]
        return [dict(a) for a in items]

    def acknowledge_alert(self, alert_id: int) -> dict:
        record = self._alerts.get(alert_id)
        if record is None:
            raise KeyError(f"Alert {alert_id} not found")
        record["acknowledged"] = True
        self._alerts[alert_id] = record
        return dict(record)

    def count_alerts(self, patient_id: int | None = None, acknowledged: bool = False) -> int:
        items = list(self._alerts.values())
        if patient_id is not None:
            items = [a for a in items if a.get("patient_id") == patient_id]
        items = [a for a in items if a.get("acknowledged") == acknowledged]
        return len(items)

    def clear(self) -> None:
        self._devices.clear()
        self._readings.clear()
        self._thresholds.clear()
        self._alerts.clear()
        for k in self._counters:
            self._counters[k] = 0
