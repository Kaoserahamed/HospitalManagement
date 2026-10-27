"""Feature flags service."""

from __future__ import annotations

from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import FeatureFlagRepository
from .schemas import FeatureFlagCreate, FeatureFlagUpdate, OverrideCreate


class FeatureFlagService:
    def __init__(self, repository: FeatureFlagRepository | None = None) -> None:
        self.repository = repository or FeatureFlagRepository()

    def create(self, data: FeatureFlagCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_by_key(payload["key"]):
            raise ValidationError("Flag with this key already exists")
        record = self.repository.create(payload)
        default_bus.publish(DomainEvent(name="FeatureFlagCreated", payload={"flag_id": record["id"]}))
        return record

    def get(self, flag_id: int) -> dict:
        record = self.repository.get(flag_id)
        if record is None:
            raise NotFoundError("FeatureFlag", flag_id)
        return record

    def get_by_key(self, key: str) -> dict:
        record = self.repository.get_by_key(key)
        if record is None:
            raise NotFoundError("FeatureFlag", key)
        return record

    def update(self, flag_id: int, data: FeatureFlagUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update(flag_id, payload)
        default_bus.publish(DomainEvent(name="FeatureFlagUpdated", payload={"flag_id": flag_id}))
        return record

    def list(self) -> list[dict]:
        return self.repository.list()

    def delete(self, flag_id: int) -> bool:
        if not self.repository.delete(flag_id):
            raise NotFoundError("FeatureFlag", flag_id)
        return True

    def toggle(self, flag_id: int, enabled: bool) -> dict:
        return self.update(flag_id, {"enabled": enabled})

    def set_rollout(self, flag_id: int, percentage: int) -> dict:
        if percentage < 0 or percentage > 100:
            raise ValidationError("percentage must be 0-100")
        return self.update(flag_id, {"rollout_percentage": percentage})

    def create_override(self, data: OverrideCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get(payload["flag_id"]) is None:
            raise NotFoundError("FeatureFlag", payload["flag_id"])
        record = self.repository.create_override(payload)
        default_bus.publish(DomainEvent(name="FeatureFlagOverrideCreated", payload={"override_id": record["id"]}))
        return record

    def list_overrides(self, flag_id: int | None = None) -> list[dict]:
        return self.repository.list_overrides(flag_id=flag_id)

    def evaluate(self, key: str, user_id: int | None = None, role: str | None = None) -> dict:
        flag = self.repository.get_by_key(key)
        if flag is None:
            raise NotFoundError("FeatureFlag", key)
        if not flag.get("enabled"):
            return {"key": key, "enabled": False, "reason": "flag_disabled"}
        # check override
        if user_id is not None:
            override = self.repository.get_override(flag["id"], user_id)
            if override:
                return {"key": key, "enabled": override["enabled"], "reason": "user_override"}
        # role targeting
        target_roles = flag.get("target_roles")
        if target_roles and role:
            roles = [r.strip() for r in target_roles.split(",")]
            if role not in roles:
                return {"key": key, "enabled": False, "reason": "role_not_targeted"}
        # rollout percentage
        pct = flag.get("rollout_percentage", 0)
        if pct >= 100:
            return {"key": key, "enabled": True, "reason": "fully_rolled_out"}
        if pct <= 0:
            return {"key": key, "enabled": False, "reason": "rollout_zero"}
        if user_id is not None:
            bucket = self.repository.hash_user(user_id, key)
            if bucket < pct:
                return {"key": key, "enabled": True, "reason": "in_rollout"}
            return {"key": key, "enabled": False, "reason": "not_in_rollout"}
        return {"key": key, "enabled": True, "reason": "default_enabled"}

    def evaluate_all(self, user_id: int | None = None, role: str | None = None) -> dict:
        result = {}
        for flag in self.repository.list():
            try:
                result[flag["key"]] = self.evaluate(flag["key"], user_id=user_id, role=role)["enabled"]
            except Exception:
                result[flag["key"]] = False
        return result

    def clear(self) -> None:
        self.repository.clear()
