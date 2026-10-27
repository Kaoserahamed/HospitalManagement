"""Lab API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import LabOrderCreate, LabOrderUpdate, LabPanelCreate, LabResultCreate
from .service import LabService

router = APIRouter(prefix="/lab", tags=["lab"])


def get_service() -> LabService:
    return LabService()


@router.post("/orders", status_code=201)
def create_order(payload: LabOrderCreate, service: LabService = Depends(get_service)) -> None:
    try:
        return service.create_order(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/orders")
def list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    status: str | None = None,
    service: LabService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_orders(params, patient_id=patient_id, status=status).to_dict()


@router.get("/orders/{order_id}")
def get_order(order_id: int, service: LabService = Depends(get_service)) -> None:
    try:
        return service.get_order(order_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/orders/{order_id}")
def update_order(order_id: int, payload: LabOrderUpdate, service: LabService = Depends(get_service)) -> None:
    try:
        return service.update_order(order_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/orders/{order_id}/collect")
def collect_sample(order_id: int, service: LabService = Depends(get_service)) -> None:
    try:
        return service.collect_sample(order_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/orders/{order_id}/process")
def start_processing(order_id: int, service: LabService = Depends(get_service)) -> None:
    try:
        return service.start_processing(order_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/orders/{order_id}/cancel")
def cancel_order(order_id: int, reason: str | None = None, service: LabService = Depends(get_service)) -> None:
    try:
        return service.cancel_order(order_id, reason)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/results", status_code=201)
def add_result(payload: LabResultCreate, service: LabService = Depends(get_service)) -> None:
    try:
        return service.add_result(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/orders/{order_id}/results")
def list_results(order_id: int, service: LabService = Depends(get_service)) -> None:
    return service.list_results(order_id)


@router.post("/panels", status_code=201)
def create_panel(payload: LabPanelCreate, service: LabService = Depends(get_service)) -> None:
    try:
        return service.create_panel(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/panels")
def list_panels(service: LabService = Depends(get_service)) -> None:
    return service.list_panels()


@router.post("/panels/{panel_id}/order")
def order_panel(panel_id: int, patient_id: int, ordering_provider: int, encounter_id: int | None = None, service: LabService = Depends(get_service)) -> None:
    try:
        return service.order_panel(panel_id, patient_id, ordering_provider, encounter_id=encounter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/patients/{patient_id}/abnormal")
def abnormal_results(patient_id: int, service: LabService = Depends(get_service)) -> None:
    return service.abnormal_results(patient_id)


@router.get("/count")
def count(service: LabService = Depends(get_service)) -> None:
    return {"count": service.count_orders()}
