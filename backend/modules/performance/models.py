"""Performance and profiling domain models."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class PerformanceMetric(Base):
        __tablename__ = "performance_metrics"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        endpoint: Mapped[str] = mapped_column(String(240), nullable=False, index=True)
        method: Mapped[str] = mapped_column(String(10), nullable=False)
        duration_ms: Mapped[float] = mapped_column(Float, nullable=False)
        status_code: Mapped[int] = mapped_column(Integer, nullable=False)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    class SlowQuery(Base):
        __tablename__ = "performance_slow_queries"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        query: Mapped[str] = mapped_column(Text, nullable=False)
        duration_ms: Mapped[float] = mapped_column(Float, nullable=False)
        params: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class CacheStats(Base):
        __tablename__ = "performance_cache_stats"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        cache_name: Mapped[str] = mapped_column(String(80), nullable=False)
        hits: Mapped[int] = mapped_column(Integer, default=0)
        misses: Mapped[int] = mapped_column(Integer, default=0)
        evictions: Mapped[int] = mapped_column(Integer, default=0)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    PerformanceMetric = None  # type: ignore
    SlowQuery = None  # type: ignore
    CacheStats = None  # type: ignore
