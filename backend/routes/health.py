"""Health and readiness endpoints.

- ``GET /health`` — liveness probe: the process is running. Checks NO
  dependencies so a dependency outage never causes cascading pod restarts.
- ``GET /ready``  — readiness probe: verifies required dependencies (database
  connectivity). A not-ready instance is removed from load balancing but is
  not restarted.
"""

from fastapi import APIRouter, Response
from sqlalchemy import text

from core.database import AsyncSessionLocal
from core.logging import get_logger

router = APIRouter(tags=["Health"])

logger = get_logger("health")


async def _check_database() -> bool:
    """Verify database connectivity with a trivial round-trip query."""
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return True
    except Exception:  # noqa: BLE001 - any failure means "not ready"
        logger.warning("readiness check failed: database unreachable", exc_info=True)
        return False


@router.get("/health")
async def health():
    """Liveness: process is up. Intentionally dependency-free."""
    return {"status": "healthy", "service": "Hospital Management API"}


@router.get("/ready")
async def ready(response: Response):
    """Readiness: all required dependencies are reachable."""
    checks = {"database": await _check_database()}
    is_ready = all(checks.values())
    if not is_ready:
        response.status_code = 503
    return {
        "status": "ready" if is_ready else "not_ready",
        "checks": checks,
    }
