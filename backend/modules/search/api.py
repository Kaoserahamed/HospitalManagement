"""Search API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query

from .schemas import SearchRequest
from .service import SearchService

router = APIRouter(prefix="/search", tags=["search"])


def get_service() -> SearchService:
    return SearchService()


@router.post("/")
def search(payload: SearchRequest, service: SearchService = Depends(get_service)) -> Any:
    return {"results": service.search(payload.query, limit=payload.limit)}


@router.get("/suggest")
def suggest(q: str, limit: int = Query(5, ge=1, le=20), service: SearchService = Depends(get_service)) -> Any:
    return {"suggestions": service.suggest(q, limit=limit)}


@router.get("/count")
def count(service: SearchService = Depends(get_service)) -> Any:
    return {"count": service.count()}


@router.post("/index")
def index_document(doc_id: str, content: str, service: SearchService = Depends(get_service)) -> Any:
    service.index_document(doc_id, content)
    return {"indexed": doc_id}


@router.delete("/index/{doc_id}")
def remove_document(doc_id: str, service: SearchService = Depends(get_service)) -> Any:
    deleted = service.remove_document(doc_id)
    return {"deleted": deleted}


@router.post("/rebuild")
def rebuild(documents: list[dict], service: SearchService = Depends(get_service)) -> Any:
    count = service.rebuild(documents)
    return {"indexed": count}


@router.post("/clear")
def clear(service: SearchService = Depends(get_service)) -> Any:
    service.clear()
    return {"message": "index cleared"}
