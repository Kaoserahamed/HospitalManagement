"""Pagination for collection endpoints.

Collections are bounded server-side: callers may request ``limit`` (1-500,
default 100) and ``offset`` (>= 0). Response bodies remain JSON arrays so the
existing frontend keeps working; the cap simply prevents unbounded queries
from exhausting memory or connection time on large datasets.
"""

from typing import NamedTuple

from fastapi import Query


class PaginationParams(NamedTuple):
    limit: int
    offset: int


def get_pagination(
    limit: int = Query(100, ge=1, le=500, description="Max items per page"),
    offset: int = Query(0, ge=0, description="Number of items to skip"),
) -> PaginationParams:
    """FastAPI dependency yielding validated ``limit``/``offset``."""
    return PaginationParams(limit=limit, offset=offset)
