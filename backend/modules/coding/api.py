"""Coding API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import CodeMappingCreate, CodeSearchRequest, CodeValidationResult, EncounterCodeCreate, MedicalCodeCreate
from .service import CodingService

router = APIRouter(prefix="/coding", tags=["coding"])


def get_service() -> CodingService:
    return CodingService()


@router.post("/codes", status_code=201)
def add_code(payload: MedicalCodeCreate, service: CodingService = Depends(get_service)) -> None:
    try:
        return service.add_code(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/codes/lookup")
def lookup(system: str, code: str, service: CodingService = Depends(get_service)) -> None:
    try:
        return service.lookup(system, code)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/codes/validate")
def validate_code(system: str, code: str, service: CodingService = Depends(get_service)) -> None:
    return service.validate_code(system, code)


@router.post("/codes/search")
def search_codes(payload: CodeSearchRequest, service: CodingService = Depends(get_service)) -> None:
    return service.search(payload)


@router.get("/codes/common/icd10")
def common_icd10(service: CodingService = Depends(get_service)) -> None:
    return service.common_icd10()


@router.get("/codes/common/cpt")
def common_cpt(service: CodingService = Depends(get_service)) -> None:
    return service.common_cpt()


@router.post("/mappings", status_code=201)
def add_mapping(payload: CodeMappingCreate, service: CodingService = Depends(get_service)) -> None:
    try:
        return service.add_mapping(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/mappings")
def map_code(source_system: str, source_code: str, target_system: str | None = None, service: CodingService = Depends(get_service)) -> None:
    return service.map_code(source_system, source_code, target_system=target_system)


@router.post("/encounter-codes", status_code=201)
def add_encounter_code(payload: EncounterCodeCreate, service: CodingService = Depends(get_service)) -> None:
    try:
        return service.add_encounter_code(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/encounter-codes/{encounter_id}")
def list_encounter_codes(encounter_id: int, service: CodingService = Depends(get_service)) -> None:
    return service.list_encounter_codes(encounter_id)


@router.delete("/encounter-codes/{code_id}", status_code=200)
def remove_encounter_code(code_id: int, service: CodingService = Depends(get_service)) -> None:
    try:
        service.remove_encounter_code(code_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc
