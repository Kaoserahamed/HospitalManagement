"""FHIR API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import FHIRBundleCreate, FHIRResourceCreate, FHIRSearchRequest, FHIRSubscriptionCreate
from .service import FHIRService

router = APIRouter(prefix="/fhir", tags=["fhir"])


def get_service() -> FHIRService:
    return FHIRService()


@router.post("/resources", status_code=201)
def create_resource(payload: FHIRResourceCreate, service: FHIRService = Depends(get_service)) -> Any:
    try:
        return service.create_resource(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/resources/{resource_type}/{resource_id}")
def get_resource(resource_type: str, resource_id: str, service: FHIRService = Depends(get_service)) -> Any:
    try:
        return service.get_resource(resource_type, resource_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/resources/{resource_type}/{resource_id}")
def update_resource(resource_type: str, resource_id: str, payload: dict, service: FHIRService = Depends(get_service)) -> Any:
    try:
        return service.update_resource(resource_type, resource_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/resources/{resource_type}/{resource_id}", status_code=204)
def delete_resource(resource_type: str, resource_id: str, service: FHIRService = Depends(get_service)) -> None:
    try:
        service.delete_resource(resource_type, resource_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/search")
def search(payload: FHIRSearchRequest, service: FHIRService = Depends(get_service)) -> Any:
    return service.search(payload).to_dict()


@router.post("/bundles", status_code=201)
def create_bundle(payload: FHIRBundleCreate, service: FHIRService = Depends(get_service)) -> Any:
    try:
        return service.create_bundle(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/bundles/{bundle_id}")
def get_bundle(bundle_id: int, service: FHIRService = Depends(get_service)) -> Any:
    try:
        return service.get_bundle(bundle_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/subscriptions", status_code=201)
def create_subscription(payload: FHIRSubscriptionCreate, service: FHIRService = Depends(get_service)) -> Any:
    try:
        return service.create_subscription(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/subscriptions")
def list_subscriptions(resource_type: str | None = None, service: FHIRService = Depends(get_service)) -> Any:
    return service.list_subscriptions(resource_type=resource_type)


@router.get("/count")
def count(service: FHIRService = Depends(get_service)) -> Any:
    return {"count": service.count()}
