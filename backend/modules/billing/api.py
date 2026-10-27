"""Billing API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    ChargeCreate,
    ClaimCreate,
    InvoiceCreate,
    InvoiceUpdate,
    PaymentCreate,
)
from .service import BillingService

router = APIRouter(prefix="/billing", tags=["billing"])


def get_service() -> BillingService:
    return BillingService()


@router.post("/charges", status_code=201)
def create_charge(payload: ChargeCreate, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.create_charge(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/charges")
def list_charges(patient_id: int | None = None, service: BillingService = Depends(get_service)) -> None:
    return service.list_charges(patient_id=patient_id)


@router.post("/invoices", status_code=201)
def create_invoice(payload: InvoiceCreate, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.create_invoice(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/invoices")
def list_invoices(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    status: str | None = None,
    service: BillingService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_invoices(params, patient_id=patient_id, status=status).to_dict()


@router.get("/invoices/{invoice_id}")
def get_invoice(invoice_id: int, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.get_invoice(invoice_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/invoices/{invoice_id}")
def update_invoice(invoice_id: int, payload: InvoiceUpdate, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.update_invoice(invoice_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/invoices/{invoice_id}/issue")
def issue_invoice(invoice_id: int, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.issue_invoice(invoice_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/invoices/{invoice_id}/cancel")
def cancel_invoice(invoice_id: int, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.cancel_invoice(invoice_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/payments", status_code=201)
def record_payment(payload: PaymentCreate, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.record_payment(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/invoices/{invoice_id}/payments")
def list_payments(invoice_id: int, service: BillingService = Depends(get_service)) -> None:
    return service.list_payments(invoice_id)


@router.post("/claims", status_code=201)
def submit_claim(payload: ClaimCreate, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.submit_claim(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/claims/{claim_id}")
def update_claim(claim_id: int, status: str, denial_reason: str | None = None, service: BillingService = Depends(get_service)) -> None:
    try:
        return service.update_claim(claim_id, status, denial_reason=denial_reason)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/claims")
def list_claims(invoice_id: int | None = None, service: BillingService = Depends(get_service)) -> None:
    return service.list_claims(invoice_id=invoice_id)


@router.get("/summary")
def billing_summary(patient_id: int | None = None, service: BillingService = Depends(get_service)) -> None:
    return service.summary(patient_id=patient_id)


@router.get("/overdue")
def overdue_invoices(days: int = 30, service: BillingService = Depends(get_service)) -> None:
    return service.overdue_invoices(days=days)
