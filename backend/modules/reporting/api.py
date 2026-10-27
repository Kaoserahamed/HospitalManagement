"""Reporting API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import ReportDefinitionCreate, ReportExecutionCreate, ReportRunRequest, ReportSubscriptionCreate
from .service import ReportingService

router = APIRouter(prefix="/reporting", tags=["reporting"])


def get_service() -> ReportingService:
    return ReportingService()


@router.post("/definitions", status_code=201)
def create_definition(payload: ReportDefinitionCreate, service: ReportingService = Depends(get_service)) -> Any:
    try:
        return service.create_definition(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/definitions")
def list_definitions(active_only: bool = False, service: ReportingService = Depends(get_service)) -> Any:
    return service.list_definitions(active_only=active_only)


@router.get("/definitions/{definition_id}")
def get_definition(definition_id: int, service: ReportingService = Depends(get_service)) -> Any:
    try:
        return service.get_definition(definition_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/definitions/{definition_id}")
def update_definition(definition_id: int, payload: dict, service: ReportingService = Depends(get_service)) -> Any:
    try:
        return service.update_definition(definition_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/definitions/{definition_id}", status_code=204)
def delete_definition(definition_id: int, service: ReportingService = Depends(get_service)) -> None:
    try:
        service.delete_definition(definition_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/run", status_code=201)
def run_report(payload: ReportRunRequest, service: ReportingService = Depends(get_service)) -> Any:
    try:
        return service.run(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/executions")
def list_executions(definition_id: int | None = None, service: ReportingService = Depends(get_service)) -> Any:
    return service.list_executions(definition_id=definition_id)


@router.get("/executions/{execution_id}")
def get_execution(execution_id: int, service: ReportingService = Depends(get_service)) -> Any:
    try:
        return service.get_execution(execution_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/subscriptions", status_code=201)
def subscribe(payload: ReportSubscriptionCreate, service: ReportingService = Depends(get_service)) -> Any:
    try:
        return service.subscribe(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/subscriptions")
def list_subscriptions(definition_id: int | None = None, service: ReportingService = Depends(get_service)) -> Any:
    return service.list_subscriptions(definition_id=definition_id)


@router.get("/scheduled")
def scheduled_reports(service: ReportingService = Depends(get_service)) -> Any:
    return service.scheduled_reports()


@router.get("/standard-definitions")
def standard_definitions(service: ReportingService = Depends(get_service)) -> Any:
    return service.standard_definitions()
