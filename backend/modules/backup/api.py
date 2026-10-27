"""Backup API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import BackupCreate, BackupScheduleCreate, RestoreCreate
from .service import BackupService

router = APIRouter(prefix="/backup", tags=["backup"])


def get_service() -> BackupService:
    return BackupService()


@router.post("/jobs", status_code=201)
def create_backup(payload: BackupCreate, service: BackupService = Depends(get_service)) -> None:
    try:
        return service.create_backup(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/jobs")
def list_backups(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    backup_type: str | None = None,
    status: str | None = None,
    service: BackupService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_backups(params, backup_type=backup_type, status=status).to_dict()


@router.get("/jobs/{backup_id}")
def get_backup(backup_id: int, service: BackupService = Depends(get_service)) -> None:
    try:
        return service.get_backup(backup_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/jobs/{backup_id}/run")
def run_backup(backup_id: int, service: BackupService = Depends(get_service)) -> None:
    try:
        return service.run_backup(backup_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/jobs/{backup_id}/fail")
def fail_backup(backup_id: int, error: str, service: BackupService = Depends(get_service)) -> None:
    try:
        return service.fail_backup(backup_id, error)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/jobs/{backup_id}", status_code=200)
def delete_backup(backup_id: int, service: BackupService = Depends(get_service)) -> None:
    try:
        service.delete_backup(backup_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/restores", status_code=201)
def create_restore(payload: RestoreCreate, service: BackupService = Depends(get_service)) -> None:
    try:
        return service.create_restore(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/restores/{restore_id}")
def get_restore(restore_id: int, service: BackupService = Depends(get_service)) -> None:
    try:
        return service.get_restore(restore_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/restores/{restore_id}/run")
def run_restore(restore_id: int, service: BackupService = Depends(get_service)) -> None:
    try:
        return service.run_restore(restore_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/schedules", status_code=201)
def create_schedule(payload: BackupScheduleCreate, service: BackupService = Depends(get_service)) -> None:
    try:
        return service.create_schedule(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/schedules")
def list_schedules(active_only: bool = False, service: BackupService = Depends(get_service)) -> None:
    return service.list_schedules(active_only=active_only)


@router.get("/schedules/due")
def due_schedules(service: BackupService = Depends(get_service)) -> None:
    return service.due_schedules()


@router.get("/latest")
def latest_backup(service: BackupService = Depends(get_service)) -> None:
    return service.latest_backup()


@router.get("/stats")
def backup_stats(service: BackupService = Depends(get_service)) -> None:
    return service.backup_stats()
