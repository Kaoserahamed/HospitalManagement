"""Security API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    EncryptionKeyCreate,
    MFAConfigCreate,
    MFAVerifyRequest,
    PermissionCheck,
    SecurityEventCreate,
    SSOLinkCreate,
)
from .service import SecurityService

router = APIRouter(prefix="/security", tags=["security"])


def get_service() -> SecurityService:
    return SecurityService()


@router.post("/mfa/setup")
def setup_mfa(user_id: int, method: str = "totp", service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.setup_mfa(user_id, method=method)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/mfa/verify")
def verify_mfa(payload: MFAVerifyRequest, service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.verify_mfa(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/mfa/disable")
def disable_mfa(user_id: int, service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.disable_mfa(user_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/mfa/status")
def mfa_status(user_id: int, service: SecurityService = Depends(get_service)) -> None:
    return service.mfa_status(user_id)


@router.post("/sso/link", status_code=201)
def link_sso(payload: SSOLinkCreate, service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.link_sso(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/sso/links")
def get_sso_links(user_id: int, service: SecurityService = Depends(get_service)) -> None:
    return service.get_sso_links(user_id)


@router.delete("/sso/link")
def unlink_sso(user_id: int, provider: str, service: SecurityService = Depends(get_service)) -> None:
    try:
        deleted = service.unlink_sso(user_id, provider)
        return {"deleted": deleted}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/events", status_code=201)
def record_event(payload: SecurityEventCreate, service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.record_event(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/events")
def list_events(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user_id: int | None = None,
    event_type: str | None = None,
    severity: str | None = None,
    service: SecurityService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_events(params, user_id=user_id, event_type=event_type, severity=severity).to_dict()


@router.post("/keys", status_code=201)
def create_key(payload: EncryptionKeyCreate, service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.create_encryption_key(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/keys/active")
def get_active_key(purpose: str, service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.get_active_key(purpose)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/keys/{key_id}/rotate")
def rotate_key(key_id: str, service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.rotate_key(key_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/permissions/check")
def check_permission(payload: PermissionCheck, service: SecurityService = Depends(get_service)) -> None:
    return service.check_permission(payload)


@router.post("/hash-password")
def hash_password(password: str, service: SecurityService = Depends(get_service)) -> None:
    return {"hash": service.hash_password(password)}


@router.post("/verify-password")
def verify_password(password: str, hashed: str, service: SecurityService = Depends(get_service)) -> None:
    return {"valid": service.verify_password(password, hashed)}


@router.post("/tokens/generate")
def generate_token(user_id: int, expiry_minutes: int = 60, service: SecurityService = Depends(get_service)) -> None:
    return {"token": service.generate_token(user_id, expiry_minutes=expiry_minutes)}


@router.post("/tokens/validate")
def validate_token(token: str, service: SecurityService = Depends(get_service)) -> None:
    try:
        return service.validate_token(token)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/encrypt")
def encrypt_field(value: str, key_id: str, service: SecurityService = Depends(get_service)) -> None:
    return {"encrypted": service.encrypt_field(value, key_id)}


@router.post("/decrypt")
def decrypt_field(value: str, key_id: str, service: SecurityService = Depends(get_service)) -> None:
    return {"decrypted": service.decrypt_field(value, key_id)}


@router.get("/summary")
def security_summary(service: SecurityService = Depends(get_service)) -> None:
    return service.security_summary()
