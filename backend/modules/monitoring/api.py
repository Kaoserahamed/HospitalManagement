"""Monitoring API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import AlertCreate, DeviceCreate, ReadingCreate, ThresholdCreate
from .service import MonitoringService

router = APIRouter(prefix="/monitoring", tags=["monitoring"])


def get_service() -> MonitoringService:
    return MonitoringService()


@router.post("/devices", status_code=201)
def register_device(payload: DeviceCreate, service: MonitoringService = Depends(get_service)) -> Any:
    try:
        return service.register_device(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/devices")
def list_devices(patient_id: int | None = None, service: MonitoringService = Depends(get_service)) -> Any:
    return service.list_devices(patient_id=patient_id)


@router.delete("/devices/{device_id}")
def deactivate_device(device_id: int, service: MonitoringService = Depends(get_service)) -> Any:
    try:
        return service.deactivate_device(device_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/readings", status_code=201)
def record_reading(payload: ReadingCreate, service: MonitoringService = Depends(get_service)) -> Any:
    try:
        return service.record_reading(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/readings")
def list_readings(patient_id: int | None = None, vital_type: str | None = None, limit: int = Query(100, ge=1, le=500), service: MonitoringService = Depends(get_service)) -> Any:
    return service.list_readings(patient_id=patient_id, vital_type=vital_type, limit=limit)


@router.post("/thresholds", status_code=201)
def create_threshold(payload: ThresholdCreate, service: MonitoringService = Depends(get_service)) -> Any:
    try:
        return service.create_threshold(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/thresholds")
def list_thresholds(service: MonitoringService = Depends(get_service)) -> Any:
    return service.list_thresholds()


@router.get("/alerts")
def list_alerts(patient_id: int | None = None, acknowledged: bool | None = None, service: MonitoringService = Depends(get_service)) -> Any:
    return service.list_alerts(patient_id=patient_id, acknowledged=acknowledged)


@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, service: MonitoringService = Depends(get_service)) -> Any:
    try:
        return service.acknowledge_alert(alert_id)
    except Exception as exc: # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/alerts/unacknowledged-count")
def unacknowledged_count(patient_id: int | None = None, service: MonitoringService = Depends(get_service)) -> Any:
    return {"count": service.unacknowledged_count(patient_id=patient_id)}


@router.get("/patients/{patient_id}/latest/{vital_type}")
def latest_reading(patient_id: int, vital_type: str, service: MonitoringService = Depends(get_service)) -> Any:
    return service.latest_reading(patient_id, vital_type)


@router.get("/patients/{patient_id}/trend/{vital_type}")
def trend(patient_id: int, vital_type: str, limit: int = Query(10, ge=1, le=100), service: MonitoringService = Depends(get_service)) -> Any:
    return service.trend(patient_id, vital_type, limit=limit)
