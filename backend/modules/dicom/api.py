"""DICOM API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from .schemas import DicomInstanceCreate, DicomSeriesCreate, DicomStudyCreate
from .service import DicomService

router = APIRouter(prefix="/dicom", tags=["dicom"])


def get_service() -> DicomService:
    return DicomService()


@router.post("/studies", status_code=201)
def create_study(payload: DicomStudyCreate, service: DicomService = Depends(get_service)) -> None:
    try:
        return service.create_study(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/studies")
def list_studies(patient_id: int | None = None, service: DicomService = Depends(get_service)) -> None:
    return service.list_studies(patient_id=patient_id)


@router.get("/studies/{study_id}")
def get_study(study_id: int, service: DicomService = Depends(get_service)) -> None:
    try:
        return service.get_study(study_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/studies/uid/{uid}")
def get_study_by_uid(uid: str, service: DicomService = Depends(get_service)) -> None:
    try:
        return service.get_study_by_uid(uid)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/series", status_code=201)
def create_series(payload: DicomSeriesCreate, service: DicomService = Depends(get_service)) -> None:
    try:
        return service.create_series(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/studies/{study_id}/series")
def list_series(study_id: int, service: DicomService = Depends(get_service)) -> None:
    return service.list_series(study_id)


@router.post("/instances", status_code=201)
def create_instance(payload: DicomInstanceCreate, service: DicomService = Depends(get_service)) -> None:
    try:
        return service.create_instance(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/series/{series_id}/instances")
def list_instances(series_id: int, service: DicomService = Depends(get_service)) -> None:
    return service.list_instances(series_id)


@router.get("/studies/{study_id}/summary")
def study_summary(study_id: int, service: DicomService = Depends(get_service)) -> None:
    try:
        return service.study_summary(study_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/count")
def count(service: DicomService = Depends(get_service)) -> None:
    return {"count": service.count_studies()}
