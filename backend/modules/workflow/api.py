"""Workflow API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import WorkflowActionRequest, WorkflowDefinitionCreate, WorkflowInstanceCreate
from .service import WorkflowService

router = APIRouter(prefix="/workflow", tags=["workflow"])


def get_service() -> WorkflowService:
    return WorkflowService()


@router.post("/definitions", status_code=201)
def create_definition(payload: WorkflowDefinitionCreate, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.create_definition(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/definitions")
def list_definitions(active_only: bool = False, service: WorkflowService = Depends(get_service)) -> None:
    return service.list_definitions(active_only=active_only)


@router.get("/definitions/{definition_id}")
def get_definition(definition_id: int, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.get_definition(definition_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/instances", status_code=201)
def start_instance(payload: WorkflowInstanceCreate, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.start_instance(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/instances")
def list_instances(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    entity_type: str | None = None,
    status: str | None = None,
    service: WorkflowService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_instances(params, entity_type=entity_type, status=status).to_dict()


@router.get("/instances/{instance_id}")
def get_instance(instance_id: int, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.get_instance(instance_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/instances/{instance_id}/advance")
def advance(instance_id: int, action: str = "next", performed_by: int | None = None, notes: str | None = None, service: WorkflowService = Depends(get_service)) -> None:
    try:
        from .schemas import WorkflowActionRequest
        return service.advance(WorkflowActionRequest(instance_id=instance_id, action=action, performed_by=performed_by, notes=notes))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/instances/{instance_id}/skip")
def skip_step(instance_id: int, step_index: int, performed_by: int | None = None, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.skip_step(instance_id, step_index, performed_by=performed_by)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/instances/{instance_id}/fail")
def fail_step(instance_id: int, step_index: int, notes: str | None = None, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.fail_step(instance_id, step_index, notes=notes)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/instances/{instance_id}/pause")
def pause(instance_id: int, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.pause(instance_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/instances/{instance_id}/resume")
def resume(instance_id: int, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.resume(instance_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/instances/{instance_id}/cancel")
def cancel(instance_id: int, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.cancel(instance_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/instances/{instance_id}/progress")
def progress(instance_id: int, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.progress(instance_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/instances/{instance_id}/history")
def history(instance_id: int, service: WorkflowService = Depends(get_service)) -> None:
    try:
        return service.history(instance_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc
