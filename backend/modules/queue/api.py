"""Queue API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import TaskCreate, TaskUpdate
from .service import QueueService

router = APIRouter(prefix="/queue", tags=["queue"])


def get_service() -> QueueService:
    return QueueService()


@router.post("/tasks", status_code=201)
def enqueue(payload: TaskCreate, service: QueueService = Depends(get_service)) -> Any:
    try:
        return service.enqueue(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/tasks")
def list_tasks(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: str | None = None,
    priority: str | None = None,
    service: QueueService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list(params, status=status, priority=priority).to_dict()


@router.get("/tasks/{task_id}")
def get_task(task_id: int, service: QueueService = Depends(get_service)) -> Any:
    try:
        return service.get(task_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/tasks/{task_id}")
def update_task(task_id: int, payload: TaskUpdate, service: QueueService = Depends(get_service)) -> Any:
    try:
        return service.update(task_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/tasks/dequeue")
def dequeue(service: QueueService = Depends(get_service)) -> Any:
    task = service.dequeue()
    if task is None:
        return {"message": "No tasks queued"}
    return task


@router.post("/tasks/{task_id}/complete")
def complete_task(task_id: int, service: QueueService = Depends(get_service)) -> Any:
    try:
        return service.complete(task_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/tasks/{task_id}/fail")
def fail_task(task_id: int, error: str, service: QueueService = Depends(get_service)) -> Any:
    try:
        return service.fail(task_id, error)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/tasks/{task_id}/cancel")
def cancel_task(task_id: int, service: QueueService = Depends(get_service)) -> Any:
    try:
        return service.cancel(task_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/tasks/{task_id}/retry")
def retry_task(task_id: int, service: QueueService = Depends(get_service)) -> Any:
    try:
        return service.retry(task_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/stats")
def queue_stats(service: QueueService = Depends(get_service)) -> Any:
    return service.stats()


@router.get("/size")
def queue_size(service: QueueService = Depends(get_service)) -> Any:
    return {"size": service.size()}
