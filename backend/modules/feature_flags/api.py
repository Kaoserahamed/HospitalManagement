"""Feature flags API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import FeatureFlagCreate, FeatureFlagUpdate, OverrideCreate
from .service import FeatureFlagService

router = APIRouter(prefix="/feature-flags", tags=["feature-flags"])


def get_service() -> FeatureFlagService:
    return FeatureFlagService()


@router.post("/", status_code=201)
def create_flag(payload: FeatureFlagCreate, service: FeatureFlagService = Depends(get_service)) -> Any:
    try:
        return service.create(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/")
def list_flags(service: FeatureFlagService = Depends(get_service)) -> Any:
    return service.list()


@router.get("/{flag_id}")
def get_flag(flag_id: int, service: FeatureFlagService = Depends(get_service)) -> Any:
    try:
        return service.get(flag_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/key/{key}")
def get_flag_by_key(key: str, service: FeatureFlagService = Depends(get_service)) -> Any:
    try:
        return service.get_by_key(key)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{flag_id}")
def update_flag(flag_id: int, payload: FeatureFlagUpdate, service: FeatureFlagService = Depends(get_service)) -> Any:
    try:
        return service.update(flag_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{flag_id}/toggle")
def toggle_flag(flag_id: int, enabled: bool, service: FeatureFlagService = Depends(get_service)) -> Any:
    try:
        return service.toggle(flag_id, enabled)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{flag_id}/rollout")
def set_rollout(flag_id: int, percentage: int, service: FeatureFlagService = Depends(get_service)) -> Any:
    try:
        return service.set_rollout(flag_id, percentage)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/{flag_id}", status_code=204)
def delete_flag(flag_id: int, service: FeatureFlagService = Depends(get_service)) -> None:
    try:
        service.delete(flag_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/overrides", status_code=201)
def create_override(payload: OverrideCreate, service: FeatureFlagService = Depends(get_service)) -> Any:
    try:
        return service.create_override(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/overrides")
def list_overrides(flag_id: int | None = None, service: FeatureFlagService = Depends(get_service)) -> Any:
    return service.list_overrides(flag_id=flag_id)


@router.post("/evaluate")
def evaluate(key: str, user_id: int | None = None, role: str | None = None, service: FeatureFlagService = Depends(get_service)) -> Any:
    try:
        return service.evaluate(key, user_id=user_id, role=role)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/evaluate-all")
def evaluate_all(user_id: int | None = None, role: str | None = None, service: FeatureFlagService = Depends(get_service)) -> Any:
    return service.evaluate_all(user_id=user_id, role=role)
