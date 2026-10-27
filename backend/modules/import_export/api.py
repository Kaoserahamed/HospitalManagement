"""Import/Export API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import ExportJobCreate, ExportRequest, ImportJobCreate, ImportRequest
from .service import ImportExportService

router = APIRouter(prefix="/import-export", tags=["import-export"])


def get_service() -> ImportExportService:
    return ImportExportService()


@router.post("/imports", status_code=201)
def create_import(payload: ImportJobCreate, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.create_import_job(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/imports")
def list_imports(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    entity_type: str | None = None,
    status: str | None = None,
    service: ImportExportService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_import_jobs(params, entity_type=entity_type, status=status).to_dict()


@router.get("/imports/{import_id}")
def get_import(import_id: int, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.get_import_job(import_id)
    except Exception as exc: # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/imports/{import_id}/process")
def process_import(import_id: int, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.process_import(import_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/imports/{import_id}/cancel")
def cancel_import(import_id: int, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.cancel_import(import_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/import")
def import_data(payload: ImportRequest, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.import_data(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/exports", status_code=201)
def create_export(payload: ExportJobCreate, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.create_export_job(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/exports")
def list_exports(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    entity_type: str | None = None,
    status: str | None = None,
    service: ImportExportService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_export_jobs(params, entity_type=entity_type, status=status).to_dict()


@router.get("/exports/{export_id}")
def get_export(export_id: int, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.get_export_job(export_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/exports/{export_id}/process")
def process_export(export_id: int, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.process_export(export_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/export")
def export_data(payload: ExportRequest, service: ImportExportService = Depends(get_service)) -> None:
    try:
        return service.export_data(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/validate")
def validate_import(entity_type: str, rows: list[dict], service: ImportExportService = Depends(get_service)) -> None:
    return service.validate_import(entity_type, rows)


@router.post("/transform")
def transform_row(entity_type: str, row: dict, mapping: dict | None = None, service: ImportExportService = Depends(get_service)) -> None:
    return service.transform_row(entity_type, row, mapping=mapping)


@router.get("/supported-entities")
def supported_entities(service: ImportExportService = Depends(get_service)) -> None:
    return service.supported_entities()


@router.get("/supported-formats")
def supported_formats(service: ImportExportService = Depends(get_service)) -> None:
    return service.supported_formats()


@router.get("/template/{entity_type}")
def generate_template(entity_type: str, service: ImportExportService = Depends(get_service)) -> None:
    return {"template": service.generate_template(entity_type)}
