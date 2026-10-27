"""Care coordination API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    CareTaskCreate,
    CareTaskUpdate,
    CareTeamCreate,
    CareTeamMemberCreate,
    DischargePlanCreate,
    HandoffCreate,
)
from .service import CareService

router = APIRouter(prefix="/care", tags=["care"])


def get_service() -> CareService:
    return CareService()


@router.post("/teams", status_code=201)
def create_team(payload: CareTeamCreate, service: CareService = Depends(get_service)) -> None:
    try:
        return service.create_team(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/teams")
def list_teams(patient_id: int | None = None, service: CareService = Depends(get_service)) -> None:
    return service.list_teams(patient_id=patient_id)


@router.post("/teams/{team_id}/members", status_code=201)
def add_member(team_id: int, user_id: int, role: str = "consulting", service: CareService = Depends(get_service)) -> None:
    try:
        return service.add_member({"care_team_id": team_id, "user_id": user_id, "role": role})
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/teams/{team_id}/members")
def list_members(team_id: int, service: CareService = Depends(get_service)) -> None:
    return service.list_members(team_id)


@router.post("/tasks", status_code=201)
def create_task(payload: CareTaskCreate, service: CareService = Depends(get_service)) -> None:
    try:
        return service.create_task(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/tasks")
def list_tasks(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    assigned_to: int | None = None,
    status: str | None = None,
    service: CareService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_tasks(params, patient_id=patient_id, assigned_to=assigned_to, status=status).to_dict()


@router.get("/tasks/{task_id}")
def get_task(task_id: int, service: CareService = Depends(get_service)) -> None:
    try:
        return service.get_task(task_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/tasks/{task_id}")
def update_task(task_id: int, payload: CareTaskUpdate, service: CareService = Depends(get_service)) -> None:
    try:
        return service.update_task(task_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/tasks/{task_id}/complete")
def complete_task(task_id: int, service: CareService = Depends(get_service)) -> None:
    try:
        return service.complete_task(task_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/patients/{patient_id}/tasks")
def open_tasks(patient_id: int, service: CareService = Depends(get_service)) -> None:
    return service.open_tasks_for_patient(patient_id)


@router.get("/tasks/overdue")
def overdue_tasks(service: CareService = Depends(get_service)) -> None:
    return service.overdue_tasks()


@router.post("/handoffs", status_code=201)
def create_handoff(payload: HandoffCreate, service: CareService = Depends(get_service)) -> None:
    try:
        return service.create_handoff(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/handoffs")
def list_handoffs(patient_id: int | None = None, to_user: int | None = None, service: CareService = Depends(get_service)) -> None:
    return service.list_handoffs(patient_id=patient_id, to_user=to_user)


@router.post("/handoffs/{handoff_id}/acknowledge")
def acknowledge_handoff(handoff_id: int, service: CareService = Depends(get_service)) -> None:
    try:
        return service.acknowledge_handoff(handoff_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/discharge-plans", status_code=201)
def create_discharge_plan(payload: DischargePlanCreate, service: CareService = Depends(get_service)) -> None:
    try:
        return service.create_discharge_plan(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/discharge-plans")
def list_discharge_plans(patient_id: int | None = None, service: CareService = Depends(get_service)) -> None:
    return service.list_discharge_plans(patient_id=patient_id)


@router.get("/discharge-plans/{plan_id}")
def get_discharge_plan(plan_id: int, service: CareService = Depends(get_service)) -> None:
    try:
        return service.get_discharge_plan(plan_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc
