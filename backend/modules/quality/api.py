"""Quality API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import BenchmarkCreate, QualityMeasureCreate, QualityResultCreate
from .service import QualityService

router = APIRouter(prefix="/quality", tags=["quality"])


def get_service() -> QualityService:
    return QualityService()


@router.post("/measures", status_code=201)
def create_measure(payload: QualityMeasureCreate, service: QualityService = Depends(get_service)) -> Any:
    try:
        return service.create_measure(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/measures")
def list_measures(category: str | None = None, service: QualityService = Depends(get_service)) -> Any:
    return service.list_measures(category=category)


@router.get("/measures/{measure_id}")
def get_measure(measure_id: int, service: QualityService = Depends(get_service)) -> Any:
    try:
        return service.get_measure(measure_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/measures/{measure_id}")
def update_measure(measure_id: int, payload: dict, service: QualityService = Depends(get_service)) -> Any:
    try:
        return service.update_measure(measure_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/results", status_code=201)
def record_result(payload: QualityResultCreate, service: QualityService = Depends(get_service)) -> Any:
    try:
        return service.record_result(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/measures/{measure_id}/results")
def list_results(measure_id: int, service: QualityService = Depends(get_service)) -> Any:
    return service.list_results(measure_id=measure_id)


@router.post("/benchmarks", status_code=201)
def create_benchmark(payload: BenchmarkCreate, service: QualityService = Depends(get_service)) -> Any:
    try:
        return service.create_benchmark(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/measures/{measure_id}/benchmarks")
def list_benchmarks(measure_id: int, service: QualityService = Depends(get_service)) -> Any:
    return service.list_benchmarks(measure_id=measure_id)


@router.get("/measures/{measure_id}/rate")
def get_rate(measure_id: int, service: QualityService = Depends(get_service)) -> Any:
    return {"rate": service.rate(measure_id)}


@router.get("/measures/{measure_id}/summary")
def get_summary(measure_id: int, service: QualityService = Depends(get_service)) -> Any:
    try:
        return service.summary(measure_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/summaries")
def all_summaries(service: QualityService = Depends(get_service)) -> Any:
    return service.all_summaries()


@router.get("/top-performers")
def top_performers(limit: int = Query(5, ge=1, le=20), service: QualityService = Depends(get_service)) -> Any:
    return service.top_performers(limit=limit)
