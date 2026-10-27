"""EHR API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    DiagnosisCreate,
    EncounterCreate,
    EncounterUpdate,
    LabResultCreate,
    PrescriptionCreate,
    VitalCreate,
)
from .service import EHRService

router = APIRouter(prefix="/ehr", tags=["ehr"])


def get_service() -> EHRService:
    return EHRService()


@router.post("/encounters", status_code=201)
def create_encounter(payload: EncounterCreate, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.create_encounter(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/encounters")
def list_encounters(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    doctor_id: int | None = None,
    service: EHRService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_encounters(params, patient_id=patient_id, doctor_id=doctor_id).to_dict()


@router.get("/encounters/{encounter_id}")
def get_encounter(encounter_id: int, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.get_encounter(encounter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/encounters/{encounter_id}")
def update_encounter(encounter_id: int, payload: EncounterUpdate, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.update_encounter(encounter_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/encounters/{encounter_id}/finalize")
def finalize_encounter(encounter_id: int, finalized_by: int | None = None, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.finalize_encounter(encounter_id, finalized_by=finalized_by)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/encounters/{encounter_id}/soap")
def soap_note(encounter_id: int, subjective: str, objective: str, assessment: str, plan: str, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.soap_note(encounter_id, subjective, objective, assessment, plan)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/encounters/{encounter_id}", status_code=200)
def delete_encounter(encounter_id: int, service: EHRService = Depends(get_service)) -> None:
    try:
        service.delete_encounter(encounter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/vitals", status_code=201)
def add_vital(payload: VitalCreate, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.add_vital(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/encounters/{encounter_id}/vitals")
def list_vitals(encounter_id: int, service: EHRService = Depends(get_service)) -> None:
    return service.list_vitals(encounter_id)


@router.post("/diagnoses", status_code=201)
def add_diagnosis(payload: DiagnosisCreate, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.add_diagnosis(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/encounters/{encounter_id}/diagnoses")
def list_diagnoses(encounter_id: int, service: EHRService = Depends(get_service)) -> None:
    return service.list_diagnoses(encounter_id)


@router.post("/lab-results", status_code=201)
def add_lab_result(payload: LabResultCreate, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.add_lab_result(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/encounters/{encounter_id}/lab-results")
def list_lab_results(encounter_id: int, service: EHRService = Depends(get_service)) -> None:
    return service.list_lab_results(encounter_id)


@router.post("/prescriptions", status_code=201)
def add_prescription(payload: PrescriptionCreate, service: EHRService = Depends(get_service)) -> None:
    try:
        return service.add_prescription(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/encounters/{encounter_id}/prescriptions")
def list_prescriptions(encounter_id: int, service: EHRService = Depends(get_service)) -> None:
    return service.list_prescriptions(encounter_id)
