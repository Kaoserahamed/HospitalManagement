"""Audit API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query

from backend.shared.pagination import PageParams

from .schemas import AuditLogCreate, AuditQuery
from .service import AuditService

router = APIRouter(prefix="/audit", tags=["audit"])


def get_service() -> AuditService:
    return AuditService()


@router.post("/logs", status_code=201)
def record_log(payload: AuditLogCreate, service: AuditService = Depends(get_service)) -> Any:
    return service.record(payload)


@router.get("/logs")
def list_logs(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    actor_id: int | None = None,
    action: str | None = None,
    resource_type: str | None = None,
    resource_id: int | None = None,
    severity: str | None = None,
    service: AuditService = Depends(get_service),
) -> Any:
    query = AuditQuery(
        actor_id=actor_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        severity=severity,
        page=page,
        per_page=per_page,
    )
    return service.list(query).to_dict()


@router.get("/logs/recent")
def recent_logs(limit: int = Query(20, ge=1, le=100), service: AuditService = Depends(get_service)) -> Any:
    return service.recent(limit=limit)


@router.get("/logs/count")
def count_logs(service: AuditService = Depends(get_service)) -> Any:
    return {"count": service.count()}
