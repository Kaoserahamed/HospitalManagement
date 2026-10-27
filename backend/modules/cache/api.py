"""Cache API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query

from .service import CacheService

router = APIRouter(prefix="/cache", tags=["cache"])


def get_service() -> CacheService:
    return CacheService()


@router.get("/keys")
def list_keys(service: CacheService = Depends(get_service)) -> Any:
    return {"keys": service.keys()}


@router.get("/size")
def size(service: CacheService = Depends(get_service)) -> Any:
    return {"size": service.size()}


@router.get("/stats")
def stats(service: CacheService = Depends(get_service)) -> Any:
    return service.stats()


@router.get("/{key}")
def get_value(key: str, service: CacheService = Depends(get_service)) -> Any:
    value = service.get(key)
    if value is None:
        return {"key": key, "value": None, "found": False}
    return {"key": key, "value": value, "found": True}


@router.put("/{key}")
def set_value(key: str, value: Any, ttl: int = Query(300, ge=1), service: CacheService = Depends(get_service)) -> Any:
    service.set(key, value, ttl)
    return {"key": key, "ttl": ttl}


@router.delete("/{key}")
def delete_value(key: str, service: CacheService = Depends(get_service)) -> Any:
    deleted = service.delete(key)
    return {"key": key, "deleted": deleted}


@router.post("/clear")
def clear(service: CacheService = Depends(get_service)) -> Any:
    service.clear()
    return {"message": "cache cleared"}


@router.post("/purge-expired")
def purge(service: CacheService = Depends(get_service)) -> Any:
    count = service.purge_expired()
    return {"purged": count}
