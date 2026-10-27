"""Cache API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query

from .service import CacheService

router = APIRouter(prefix="/cache", tags=["cache"])


def get_service() -> CacheService:
    return CacheService()


@router.get("/keys")
def list_keys(service: CacheService = Depends(get_service)) -> None:
    return {"keys": service.keys()}


@router.get("/size")
def size(service: CacheService = Depends(get_service)) -> None:
    return {"size": service.size()}


@router.get("/stats")
def stats(service: CacheService = Depends(get_service)) -> None:
    return service.stats()


@router.get("/{key}")
def get_value(key: str, service: CacheService = Depends(get_service)) -> None:
    value = service.get(key)
    if value is None:
        return {"key": key, "value": None, "found": False}
    return {"key": key, "value": value, "found": True}


@router.put("/{key}")
def set_value(key: str, value: Any, ttl: int = Query(300, ge=1), service: CacheService = Depends(get_service)) -> None:
    service.set(key, value, ttl)
    return {"key": key, "ttl": ttl}


@router.delete("/{key}")
def delete_value(key: str, service: CacheService = Depends(get_service)) -> None:
    deleted = service.delete(key)
    return {"key": key, "deleted": deleted}


@router.post("/clear")
def clear(service: CacheService = Depends(get_service)) -> None:
    service.clear()
    return {"message": "cache cleared"}


@router.post("/purge-expired")
def purge(service: CacheService = Depends(get_service)) -> None:
    count = service.purge_expired()
    return {"purged": count}
