"""Authentication primitives shared across modules."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class Role(str, Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    RECEPTIONIST = "receptionist"
    PATIENT = "patient"
    PHARMACIST = "pharmacist"


@dataclass(frozen=True)
class Principal:
    """Authenticated principal extracted from a JWT."""

    user_id: str
    role: Role
    email: str | None = None
    scopes: tuple[str, ...] = ()

    def has_role(self, *roles: Role) -> bool:
        return self.role in roles

    def has_scope(self, scope: str) -> bool:
        return scope in self.scopes


ROLE_PERMISSIONS: dict[Role, set[str]] = {
    Role.ADMIN: {"users:read", "users:write", "departments:write", "schedules:write"},
    Role.DOCTOR: {"patients:read", "appointments:read", "ehr:write", "prescriptions:write"},
    Role.RECEPTIONIST: {"patients:write", "appointments:write", "patients:read"},
    Role.PATIENT: {"appointments:read:own", "prescriptions:read:own", "profile:write:own"},
    Role.PHARMACIST: {"pharmacy:read", "pharmacy:write", "prescriptions:read"},
}


def permissions_for(role: Role) -> set[str]:
    return set(ROLE_PERMISSIONS.get(role, set()))


def can(principal: Principal, permission: str) -> bool:
    perms = permissions_for(principal.role)
    if permission in perms:
        return True
    # owner-scoped permissions
    if f"{permission}:own" in perms and permission.endswith(":own"):
        return True
    return False
