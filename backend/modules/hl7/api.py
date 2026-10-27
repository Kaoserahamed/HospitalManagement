"""HL7 API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import HL7MessageCreate, HL7ParseRequest
from .service import HL7Service

router = APIRouter(prefix="/hl7", tags=["hl7"])


def get_service() -> HL7Service:
    return HL7Service()


@router.post("/parse")
def parse(payload: HL7ParseRequest, service: HL7Service = Depends(get_service)) -> Any:
    try:
        return service.parse_message(payload.raw_message)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/messages", status_code=201)
def receive(payload: HL7MessageCreate, service: HL7Service = Depends(get_service)) -> Any:
    try:
        return service.receive(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/messages")
def list_messages(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    message_type: str | None = None,
    status: str | None = None,
    service: HL7Service = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list(params, message_type=message_type, status=status).to_dict()


@router.get("/messages/{message_id}")
def get_message(message_id: int, service: HL7Service = Depends(get_service)) -> Any:
    try:
        return service.get(message_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/messages/{message_id}/process")
def process_message(message_id: int, service: HL7Service = Depends(get_service)) -> Any:
    try:
        return service.process(message_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/messages/{message_id}/fail")
def fail_message(message_id: int, error: str, service: HL7Service = Depends(get_service)) -> Any:
    try:
        return service.fail(message_id, error)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/ack")
def generate_ack(message_control_id: str, ack_code: str = "AA", text: str | None = None, service: HL7Service = Depends(get_service)) -> Any:
    return {"ack": service.generate_ack(message_control_id, ack_code=ack_code, text=text)}


@router.post("/adt")
def handle_adt(patient_id: int, event: str = "A01", service: HL7Service = Depends(get_service)) -> Any:
    return service.handle_adt(patient_id, event)


@router.post("/oru")
def handle_oru(patient_id: int, observations: list = [], service: HL7Service = Depends(get_service)) -> Any:
    return service.handle_oru(patient_id, observations)


@router.post("/orm")
def handle_orm(patient_id: int, orders: list = [], service: HL7Service = Depends(get_service)) -> Any:
    return service.handle_orm(patient_id, orders)


@router.get("/count")
def count(service: HL7Service = Depends(get_service)) -> Any:
    return {"count": service.count()}
