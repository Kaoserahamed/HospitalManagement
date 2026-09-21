from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.errors import register_exception_handlers
from core.logging import configure_logging
from core.middleware import CorrelationIdMiddleware
from routes.appointment import router as appointment_router
from routes.auth import router as auth_router
from routes.department import router as department_router
from routes.doctor_schedule import router as schedule_router
from routes.patient import router as patient_router
from routes.prescription import router as prescription_router

# Configure structured logging before any route/module logs.
configure_logging(settings.LOG_LEVEL)

app = FastAPI(title="Hospital Management System API")

# Correlation IDs: every request gets an X-Request-ID echoed in responses and
# attached to all log records (see core/middleware.py).
app.add_middleware(CorrelationIdMiddleware)

# Standardized error envelope for all error responses (see core/errors.py).
register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(department_router)
app.include_router(appointment_router)
app.include_router(schedule_router)
app.include_router(patient_router)
app.include_router(prescription_router)


@app.get("/")
async def root():
    return {"message": "API Running"}


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "Hospital Management API"}


@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {}
