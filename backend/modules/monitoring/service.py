"""Monitoring service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import MonitoringRepository
from .schemas import AlertCreate, DeviceCreate, ReadingCreate, ThresholdCreate


class MonitoringService:
    def __init__(self, repository: MonitoringRepository | None = None) -> None:
        self.repository = repository or MonitoringRepository()

    def register_device(self, data: DeviceCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_device(payload)
        default_bus.publish(DomainEvent(name="DeviceRegistered", payload={"device_id": record["id"]}))
        return record

    def list_devices(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_devices(patient_id=patient_id)

    def deactivate_device(self, device_id: int) -> dict:
        device = self.repository.get_device(device_id)
        if device is None:
            raise NotFoundError("Device", device_id)
        device["is_active"] = False
        self.repository._devices[device_id] = device
        return device

    def record_reading(self, data: ReadingCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_reading(payload)
        # check thresholds
        threshold = self.repository.get_threshold(payload["vital_type"])
        if threshold:
            value = payload["value"]
            min_v = threshold.get("min_value")
            max_v = threshold.get("max_value")
            if (min_v is not None and value < min_v) or (max_v is not None and value > max_v):
                alert = self.repository.create_alert({
                    "patient_id": payload["patient_id"],
                    "vital_type": payload["vital_type"],
                    "value": value,
                    "severity": threshold.get("severity", "warning"),
                    "message": f"{payload['vital_type']} reading {value} outside threshold",
                })
                default_bus.publish(DomainEvent(name="MonitoringAlertCreated", payload={"alert_id": alert["id"]}))
        default_bus.publish(DomainEvent(name="VitalReadingRecorded", payload={"reading_id": record["id"]}))
        return record

    def list_readings(self, patient_id: int | None = None, vital_type: str | None = None, limit: int = 100) -> list[dict]:
        return self.repository.list_readings(patient_id=patient_id, vital_type=vital_type, limit=limit)

    def create_threshold(self, data: ThresholdCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_threshold(payload)
        default_bus.publish(DomainEvent(name="ThresholdCreated", payload={"threshold_id": record["id"]}))
        return record

    def list_thresholds(self) -> list[dict]:
        return self.repository.list_thresholds()

    def list_alerts(self, patient_id: int | None = None, acknowledged: bool | None = None) -> list[dict]:
        return self.repository.list_alerts(patient_id=patient_id, acknowledged=acknowledged)

    def acknowledge_alert(self, alert_id: int) -> dict:
        record = self.repository.acknowledge_alert(alert_id)
        default_bus.publish(DomainEvent(name="AlertAcknowledged", payload={"alert_id": alert_id}))
        return record

    def unacknowledged_count(self, patient_id: int | None = None) -> int:
        return self.repository.count_alerts(patient_id=patient_id, acknowledged=False)

    def latest_reading(self, patient_id: int, vital_type: str) -> dict | None:
        readings = self.repository.list_readings(patient_id=patient_id, vital_type=vital_type, limit=1)
        return readings[0] if readings else None

    def trend(self, patient_id: int, vital_type: str, limit: int = 10) -> list[dict]:
        return self.repository.list_readings(patient_id=patient_id, vital_type=vital_type, limit=limit)

    def clear(self) -> None:
        self.repository.clear()
