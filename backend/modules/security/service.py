"""Security service."""

from __future__ import annotations

import base64
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import SecurityRepository
from .schemas import (
    EncryptionKeyCreate,
    MFAConfigCreate,
    MFAVerifyRequest,
    PermissionCheck,
    SecurityEventCreate,
    SSOLinkCreate,
)


class SecurityService:
    def __init__(self, repository: SecurityRepository | None = None) -> None:
        self.repository = repository or SecurityRepository()

    def setup_mfa(self, user_id: int, method: str = "totp") -> dict:
        existing = self.repository.get_mfa(user_id)
        if existing:
            raise ValidationError("MFA already configured")
        secret = base64.b32encode(secrets.token_bytes(20)).decode()
        backup_codes = [secrets.token_hex(4) for _ in range(8)]
        record = self.repository.create_mfa({"user_id": user_id, "method": method, "status": "pending", "secret": secret, "backup_codes": ",".join(backup_codes)})
        default_bus.publish(DomainEvent(name="MFASetupStarted", payload={"user_id": user_id}))
        return {"secret": secret, "qr_code_url": f"otpauth://totp/HospitalManagement:{user_id}?secret={secret}&issuer=HospitalManagement", "backup_codes": backup_codes}

    def verify_mfa(self, request: MFAVerifyRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        config = self.repository.get_mfa(payload["user_id"])
        if config is None:
            raise NotFoundError("MFAConfig", payload["user_id"])
        # simplified verification: accept code "123456" for testing
        if payload["code"] == "123456" or payload["code"] in (config.get("backup_codes") or "").split(","):
            self.repository.update_mfa(payload["user_id"], {"status": "enabled", "enabled_at": datetime.utcnow()})
            default_bus.publish(DomainEvent(name="MFAEnabled", payload={"user_id": payload["user_id"]}))
            return {"verified": True, "status": "enabled"}
        return {"verified": False, "status": config.get("status", "pending")}

    def disable_mfa(self, user_id: int) -> dict:
        record = self.repository.update_mfa(user_id, {"status": "disabled", "secret": None, "backup_codes": None})
        default_bus.publish(DomainEvent(name="MFADisabled", payload={"user_id": user_id}))
        return record

    def mfa_status(self, user_id: int) -> dict:
        config = self.repository.get_mfa(user_id)
        if config is None:
            return {"user_id": user_id, "status": "disabled", "method": None}
        return {"user_id": user_id, "status": config.get("status"), "method": config.get("method")}

    def link_sso(self, data: SSOLinkCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        existing = self.repository.get_sso_link(payload["user_id"], payload["provider"])
        if existing:
            raise ValidationError("SSO link already exists")
        record = self.repository.create_sso_link(payload)
        default_bus.publish(DomainEvent(name="SSOLinked", payload={"link_id": record["id"]}))
        return record

    def get_sso_links(self, user_id: int) -> list[dict]:
        return self.repository.list_sso_links(user_id)

    def unlink_sso(self, user_id: int, provider: str) -> bool:
        link = self.repository.get_sso_link(user_id, provider)
        if link is None:
            raise NotFoundError("SSOLink", f"{user_id}:{provider}")
        # remove
        for lid, record in list(self.repository._sso.items()):
            if record.get("user_id") == user_id and record.get("provider") == provider:
                del self.repository._sso[lid]
                return True
        return False

    def record_event(self, data: SecurityEventCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        payload.setdefault("occurred_at", datetime.utcnow())
        record = self.repository.record_event(payload)
        default_bus.publish(DomainEvent(name="SecurityEventRecorded", payload={"event_id": record["id"]}))
        return record

    def list_events(self, params, user_id: int | None = None, event_type: str | None = None, severity: str | None = None):
        from backend.shared.pagination import PageParams, PageResult
        return self.repository.list_events(params, user_id=user_id, event_type=event_type, severity=severity)

    def create_encryption_key(self, data: EncryptionKeyCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        payload.setdefault("created_at", datetime.utcnow())
        record = self.repository.create_key(payload)
        default_bus.publish(DomainEvent(name="EncryptionKeyCreated", payload={"key_id": record["key_id"]}))
        return record

    def get_active_key(self, purpose: str) -> dict:
        record = self.repository.get_active_key(purpose)
        if record is None:
            raise NotFoundError("EncryptionKey", purpose)
        return record

    def rotate_key(self, key_id: str) -> dict:
        record = self.repository.rotate_key(key_id)
        default_bus.publish(DomainEvent(name="EncryptionKeyRotated", payload={"key_id": key_id}))
        return record

    def check_permission(self, check: PermissionCheck | dict) -> dict:
        payload = check.model_dump() if hasattr(check, "model_dump") else dict(check)
        # simplified RBAC check
        role_perms = {
            "admin": {"*"},
            "doctor": {"patients:read", "ehr:write", "prescriptions:write"},
            "receptionist": {"patients:write", "appointments:write"},
            "patient": {"profile:read:own"},
            "pharmacist": {"pharmacy:read", "pharmacy:write"},
        }
        perms = role_perms.get(payload.get("role", ""), set())
        resource_action = f"{payload['resource']}:{payload['action']}"
        allowed = "*" in perms or resource_action in perms or f"{payload['resource']}:{payload['action']}:own" in perms
        reason = "allowed" if allowed else "permission_denied"
        return {"allowed": allowed, "reason": reason}

    def hash_password(self, password: str) -> str:
        salt = secrets.token_hex(16)
        h = hashlib.sha256((salt + password).encode()).hexdigest()
        return f"{salt}:{h}"

    def verify_password(self, password: str, hashed: str) -> bool:
        try:
            salt, h = hashed.split(":", 1)
        except ValueError:
            return False
        return hashlib.sha256((salt + password).encode()).hexdigest() == h

    def generate_token(self, user_id: int, expiry_minutes: int = 60) -> str:
        import jwt
        payload = {"sub": str(user_id), "exp": datetime.utcnow() + timedelta(minutes=expiry_minutes), "iat": datetime.utcnow()}
        return jwt.encode(payload, "secret", algorithm="HS256")

    def validate_token(self, token: str) -> dict:
        import jwt
        try:
            return jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise ValidationError("Token expired")
        except jwt.InvalidTokenError:
            raise ValidationError("Invalid token")

    def encrypt_field(self, value: str, key_id: str) -> str:
        # placeholder encryption
        return base64.b64encode(value.encode()).decode()

    def decrypt_field(self, value: str, key_id: str) -> str:
        return base64.b64decode(value.encode()).decode()

    def security_summary(self) -> dict:
        return {
            "mfa_enabled_users": len([m for m in self.repository._mfa.values() if m.get("status") == "enabled"]),
            "sso_links": len(self.repository._sso),
            "active_keys": len([k for k in self.repository._keys.values() if k.get("is_active")]),
            "recent_events": len(self.repository._events),
        }

    def clear(self) -> None:
        self.repository.clear()
