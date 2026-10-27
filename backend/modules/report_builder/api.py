"""Report builder API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import ReportDashboardCreate, ReportExportCreate, ReportRunRequest, ReportScheduleCreate, ReportTemplateCreate
from .service import ReportBuilderService

router = APIRouter(prefix="/report-builder", tags=["report-builder"])


def get_service() -> ReportBuilderService:
    return ReportBuilderService()


@router.post("/templates", status_code=201)
def create_template(payload: ReportTemplateCreate, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.create_template(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/templates")
def list_templates(active_only: bool = False, service: ReportBuilderService = Depends(get_service)) -> None:
    return service.list_templates(active_only=active_only)


@router.get("/templates/{template_id}")
def get_template(template_id: int, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.get_template(template_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/templates/{template_id}")
def update_template(template_id: int, payload: dict, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.update_template(template_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/templates/{template_id}", status_code=200)
def delete_template(template_id: int, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        service.delete_template(template_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/schedules", status_code=201)
def create_schedule(payload: ReportScheduleCreate, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.create_schedule(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/schedules")
def list_schedules(template_id: int | None = None, active_only: bool = False, service: ReportBuilderService = Depends(get_service)) -> None:
    return service.list_schedules(template_id=template_id, active_only=active_only)


@router.get("/schedules/due")
def due_schedules(service: ReportBuilderService = Depends(get_service)) -> None:
    return service.due_schedules()


@router.post("/run", status_code=201)
def run_report(payload: ReportRunRequest, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.run(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/exports", status_code=201)
def export_report(payload: ReportExportCreate, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.export(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/exports")
def list_exports(template_id: int | None = None, service: ReportBuilderService = Depends(get_service)) -> None:
    return service.list_exports(template_id=template_id)


@router.get("/exports/{export_id}")
def get_export(export_id: int, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.get_export(export_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/dashboards", status_code=201)
def create_dashboard(payload: ReportDashboardCreate, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.create_dashboard(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/dashboards")
def list_dashboards(service: ReportBuilderService = Depends(get_service)) -> None:
    return service.list_dashboards()


@router.get("/dashboards/{dashboard_id}")
def get_dashboard(dashboard_id: int, service: ReportBuilderService = Depends(get_service)) -> None:
    try:
        return service.get_dashboard(dashboard_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/dashboards/default")
def default_dashboard(service: ReportBuilderService = Depends(get_service)) -> None:
    return service.default_dashboard()


@router.get("/standard-templates")
def standard_templates(service: ReportBuilderService = Depends(get_service)) -> None:
    return service.standard_templates()
