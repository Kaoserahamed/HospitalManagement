"""Pharmacy API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    DispenseCreate,
    InteractionCheck,
    LotCreate,
    MedicationCreate,
    StockCreate,
    SupplierCreate,
)
from .service import PharmacyService

router = APIRouter(prefix="/pharmacy", tags=["pharmacy"])


def get_service() -> PharmacyService:
    return PharmacyService()


@router.post("/medications", status_code=201)
def create_medication(payload: MedicationCreate, service: PharmacyService = Depends(get_service)) -> None:
    try:
        return service.create_medication(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/medications")
def list_medications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = None,
    service: PharmacyService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_medications(params, search=search).to_dict()


@router.get("/medications/{medication_id}")
def get_medication(medication_id: int, service: PharmacyService = Depends(get_service)) -> None:
    try:
        return service.get_medication(medication_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/stock", status_code=201)
def create_stock(payload: StockCreate, service: PharmacyService = Depends(get_service)) -> None:
    try:
        return service.create_stock(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/stock/{stock_id}")
def update_stock(stock_id: int, quantity: int, service: PharmacyService = Depends(get_service)) -> None:
    try:
        return service.update_stock(stock_id, quantity)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/stock/low")
def low_stock(service: PharmacyService = Depends(get_service)) -> None:
    return service.low_stock_alerts()


@router.post("/lots", status_code=201)
def create_lot(payload: LotCreate, service: PharmacyService = Depends(get_service)) -> None:
    try:
        return service.create_lot(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/lots")
def list_lots(medication_id: int | None = None, expiring_within_days: int | None = None, service: PharmacyService = Depends(get_service)) -> None:
    return service.list_lots(medication_id=medication_id, expiring_within_days=expiring_within_days)


@router.post("/suppliers", status_code=201)
def create_supplier(payload: SupplierCreate, service: PharmacyService = Depends(get_service)) -> None:
    try:
        return service.create_supplier(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/suppliers")
def list_suppliers(service: PharmacyService = Depends(get_service)) -> None:
    return service.list_suppliers()


@router.post("/dispense", status_code=201)
def dispense(payload: DispenseCreate, service: PharmacyService = Depends(get_service)) -> None:
    try:
        return service.dispense(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/dispenses")
def list_dispenses(prescription_id: int | None = None, service: PharmacyService = Depends(get_service)) -> None:
    return service.list_dispenses(prescription_id=prescription_id)


@router.post("/interactions/check")
def check_interaction(payload: InteractionCheck, service: PharmacyService = Depends(get_service)) -> None:
    return service.check_interaction(payload)
