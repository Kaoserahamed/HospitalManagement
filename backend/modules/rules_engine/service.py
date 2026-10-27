"""Rules engine service."""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import RulesEngineRepository
from .schemas import RuleCreate, RuleEvaluationRequest, RuleSetCreate


class RulesEngineService:
    def __init__(self, repository: RulesEngineRepository | None = None) -> None:
        self.repository = repository or RulesEngineRepository()

    def create_rule(self, data: RuleCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_rule(payload)
        default_bus.publish(DomainEvent(name="RuleCreated", payload={"rule_id": record["id"]}))
        return record

    def get_rule(self, rule_id: int) -> dict:
        record = self.repository.get_rule(rule_id)
        if record is None:
            raise NotFoundError("Rule", rule_id)
        return record

    def list_rules(self, rule_type: str | None = None, status: str | None = None) -> list[dict]:
        return self.repository.list_rules(rule_type=rule_type, status=status)

    def update_rule(self, rule_id: int, data: dict) -> dict:
        record = self.repository.update_rule(rule_id, data)
        default_bus.publish(DomainEvent(name="RuleUpdated", payload={"rule_id": rule_id}))
        return record

    def activate_rule(self, rule_id: int) -> dict:
        return self.repository.update_rule(rule_id, {"status": "active"})

    def disable_rule(self, rule_id: int) -> dict:
        return self.repository.update_rule(rule_id, {"status": "disabled"})

    def evaluate(self, request: RuleEvaluationRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        rule = self.get_rule(payload["rule_id"])
        input_data = payload["input_data"]
        result = "false"
        output = None
        error = None
        try:
            # simple condition evaluation (placeholder)
            condition = rule.get("condition", "")
            # evaluate based on input
            if self._eval_condition(condition, input_data):
                result = "true"
                output = {"action": rule.get("action")}
            else:
                result = "false"
            self.repository.create_execution({"rule_id": rule["id"], "input_data": str(input_data), "output_data": str(output), "result": result})
            default_bus.publish(DomainEvent(name="RuleEvaluated", payload={"rule_id": rule["id"], "result": result}))
        except Exception as exc:  # noqa: BLE001
            error = str(exc)
            result = "error"
            self.repository.create_execution({"rule_id": rule["id"], "input_data": str(input_data), "result": result, "error": error})
        return {"rule_id": rule["id"], "result": result, "output_data": output, "error": error}

    def _eval_condition(self, condition: str, data: dict) -> bool:
        # placeholder condition evaluation
        # supports simple "field > value" or "field == value"
        try:
            if "==" in condition:
                field, value = condition.split("==", 1)
                field = field.strip()
                value = value.strip().strip("'\"")
                return str(data.get(field)) == value
            if ">" in condition:
                field, value = condition.split(">", 1)
                field = field.strip()
                value = float(value.strip())
                return float(data.get(field, 0)) > value
            if "<" in condition:
                field, value = condition.split("<", 1)
                field = field.strip()
                value = float(value.strip())
                return float(data.get(field, 0)) < value
        except (ValueError, TypeError):
            pass
        return False

    def execute_rule_set(self, set_id: int, input_data: dict) -> list[dict]:
        rule_set = self.repository.get_set(set_id)
        if rule_set is None:
            raise NotFoundError("RuleSet", set_id)
        rule_ids = [int(x) for x in rule_set["rule_ids"].split(",") if x.strip()]
        results = []
        for rid in rule_ids:
            try:
                result = self.evaluate({"rule_id": rid, "input_data": input_data})
                results.append(result)
            except Exception as exc:  # noqa: BLE001
                results.append({"rule_id": rid, "result": "error", "error": str(exc)})
        return results

    def create_rule_set(self, data: RuleSetCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_set(payload)
        default_bus.publish(DomainEvent(name="RuleSetCreated", payload={"set_id": record["id"]}))
        return record

    def list_rule_sets(self) -> list[dict]:
        return self.repository.list_sets()

    def list_executions(self, rule_id: int | None = None) -> list[dict]:
        return self.repository.list_executions(rule_id=rule_id)

    def active_rules(self) -> list[dict]:
        return self.repository.list_rules(status="active")

    def rules_by_type(self, rule_type: str) -> list[dict]:
        return self.repository.list_rules(rule_type=rule_type)

    def clear(self) -> None:
        self.repository.clear()
