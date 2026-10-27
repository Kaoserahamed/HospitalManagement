"""Pagination helpers for list endpoints."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Generic, Sequence, TypeVar

T = TypeVar("T")


@dataclass(frozen=True)
class PageParams:
    """Pagination parameters parsed from query string."""

    page: int = 1
    per_page: int = 20

    def __post_init__(self) -> None:
        if self.page < 1:
            raise ValueError("page must be >= 1")
        if self.per_page < 1 or self.per_page > 100:
            raise ValueError("per_page must be between 1 and 100")

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.per_page

    @property
    def limit(self) -> int:
        return self.per_page


@dataclass(frozen=True)
class PageResult(Generic[T]):
    """A single page of results with metadata."""

    items: Sequence[T]
    page: int
    per_page: int
    total: int

    @property
    def total_pages(self) -> int:
        if self.per_page == 0:
            return 0
        return (self.total + self.per_page - 1) // self.per_page

    @property
    def has_next(self) -> bool:
        return self.page < self.total_pages

    @property
    def has_prev(self) -> bool:
        return self.page > 1

    def to_dict(self) -> dict:
        return {
            "items": list(self.items),
            "page": self.page,
            "per_page": self.per_page,
            "total": self.total,
            "total_pages": self.total_pages,
            "has_next": self.has_next,
            "has_prev": self.has_prev,
        }


def paginate(items: Sequence[T], params: PageParams, total: int) -> PageResult[T]:
    """Wrap a slice of items into a PageResult."""
    return PageResult(items=items, page=params.page, per_page=params.per_page, total=total)


def clamp_page(page: int, total: int, per_page: int) -> int:
    """Clamp a page number to a valid range."""
    if per_page <= 0:
        return 1
    max_page = max(1, (total + per_page - 1) // per_page)
    return min(max(1, page), max_page)


SORT_DIRECTIONS = ("asc", "desc")


def normalize_sort(sort: str | None, allowed: set[str], default: str) -> tuple[str, str]:
    """Parse a sort string like 'name:asc' into (field, direction)."""
    if not sort:
        return default, "asc"
    if ":" in sort:
        field, direction = sort.split(":", 1)
    else:
        field, direction = sort, "asc"
    if field not in allowed:
        raise ValueError(f"sort field not allowed: {field}")
    if direction not in SORT_DIRECTIONS:
        raise ValueError(f"sort direction not allowed: {direction}")
    return field, direction
