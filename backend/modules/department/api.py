"""Department API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import DepartmentCreate, DepartmentUpdate, EquipmentCreate, RoomCreate
from .service import DepartmentService

router = APIRouter(prefix="/departments", tags=["departments"])


def get_service() -> DepartmentService:
    return DepartmentService()


@router.get("/")
def list_departments(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = None,
    active_only: bool = False,
    service: DepartmentService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list(params, search=search, active_only=active_only).to_dict()


@router.post("/", status_code=201)
def create_department(payload: DepartmentCreate, service: DepartmentService = Depends(get_service)) -> Any:
    try:
        return service.create(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{department_id}")
def get_department(department_id: int, service: DepartmentService = Depends(get_service)) -> Any:
    try:
        return service.get(department_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{department_id}")
def update_department(department_id: int, payload: DepartmentUpdate, service: DepartmentService = Depends(get_service)) -> Any:
    try:
        return service.update(department_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/{department_id}", status_code=204)
def delete_department(department_id: int, service: DepartmentService = Depends(get_service)) -> None:
    try:
        service.delete(department_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{department_id}/rooms", status_code=201)
def add_room(department_id: int, payload: RoomCreate, service: DepartmentService = Depends(get_service)) -> Any:
    try:
        data = payload.model_dump()
        data["department_id"] = department_id
        return service.add_room(data)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{department_id}/rooms")
def list_rooms(department_id: int, service: DepartmentService = Depends(get_service)) -> Any:
    return service.list_rooms(department_id=department_id)


@router.post("/{department_id}/equipment", status_code=201)
def add_equipment(department_id: int, payload: EquipmentCreate, service: DepartmentService = Depends(get_service)) -> Any:
    try:
        data = payload.model_dump()
        data["department_id"] = department_id
        return service.add_equipment(data)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{department_id}/equipment")
def list_equipment(department_id: int, service: DepartmentService = Depends(get_service)) -> Any:
    return service.list_equipment(department_id=department_id)
