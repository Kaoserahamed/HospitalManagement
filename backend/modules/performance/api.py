"""Performance API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import CacheStatsCreate, PerformanceMetricCreate, SlowQueryCreate
from .service import PerformanceService

router = APIRouter(prefix="/performance", tags=["performance"])


def get_service() -> PerformanceService:
    return PerformanceService()


@router.post("/metrics", status_code=201)
def record_metric(payload: PerformanceMetricCreate, service: PerformanceService = Depends(get_service)) -> Any:
    try:
        return service.record_metric(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/metrics")
def list_metrics(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    endpoint: str | None = None,
    service: PerformanceService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_metrics(params, endpoint=endpoint).to_dict()


@router.post("/slow-queries", status_code=201)
def record_slow_query(payload: SlowQueryCreate, service: PerformanceService = Depends(get_service)) -> Any:
    try:
        return service.record_slow_query(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/slow-queries")
def list_slow_queries(limit: int = Query(20, ge=1, le=100), service: PerformanceService = Depends(get_service)) -> Any:
    return service.list_slow_queries(limit=limit)


@router.post("/cache-stats", status_code=201)
def record_cache_stats(payload: CacheStatsCreate, service: PerformanceService = Depends(get_service)) -> Any:
    try:
        return service.record_cache_stats(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/cache-stats")
def list_cache_stats(cache_name: str | None = None, service: PerformanceService = Depends(get_service)) -> Any:
    return service.list_cache_stats(cache_name=cache_name)


@router.get("/summary")
def summary(endpoint: str | None = None, service: PerformanceService = Depends(get_service)) -> Any:
    return service.summary(endpoint=endpoint)


@router.get("/slowest-endpoints")
def slowest_endpoints(limit: int = Query(5, ge=1, le=20), service: PerformanceService = Depends(get_service)) -> Any:
    return service.slowest_endpoints(limit=limit)


@router.get("/cache-hit-rate")
def cache_hit_rate(cache_name: str, service: PerformanceService = Depends(get_service)) -> Any:
    return {"rate": service.cache_hit_rate(cache_name)}


@router.get("/top-slow-queries")
def top_slow_queries(limit: int = Query(10, ge=1, le=50), service: PerformanceService = Depends(get_service)) -> Any:
    return service.top_slow_queries(limit=limit)
