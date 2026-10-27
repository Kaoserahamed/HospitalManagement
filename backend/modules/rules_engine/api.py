"""Rules engine API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import RuleCreate, RuleEvaluationRequest, RuleSetCreate
from .service import RulesEngineService

router = APIRouter(prefix="/rules", tags=["rules"])


def get_service() -> RulesEngineService:
    return RulesEngineService()


@router.post("/", status_code=201)
def create_rule(payload: RuleCreate, service: RulesEngineService = Depends(get_service)) -> None:
    try:
        return service.create_rule(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/")
def list_rules(rule_type: str | None = None, status: str | None = None, service: RulesEngineService = Depends(get_service)) -> None:
    return service.list_rules(rule_type=rule_type, status=status)


@router.get("/active")
def active_rules(service: RulesEngineService = Depends(get_service)) -> None:
    return service.active_rules()


@router.get("/{rule_id}")
def get_rule(rule_id: int, service: RulesEngineService = Depends(get_service)) -> None:
    try:
        return service.get_rule(rule_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{rule_id}")
def update_rule(rule_id: int, payload: dict, service: RulesEngineService = Depends(get_service)) -> None:
    try:
        return service.update_rule(rule_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{rule_id}/activate")
def activate_rule(rule_id: int, service: RulesEngineService = Depends(get_service)) -> None:
    try:
        return service.activate_rule(rule_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{rule_id}/disable")
def disable_rule(rule_id: int, service: RulesEngineService = Depends(get_service)) -> None:
    try:
        return service.disable_rule(rule_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/evaluate")
def evaluate(payload: RuleEvaluationRequest, service: RulesEngineService = Depends(get_service)) -> None:
    try:
        return service.evaluate(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/sets", status_code=201)
def create_set(payload: RuleSetCreate, service: RulesEngineService = Depends(get_service)) -> None:
    try:
        return service.create_rule_set(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/sets")
def list_sets(service: RulesEngineService = Depends(get_service)) -> None:
    return service.list_rule_sets()


@router.post("/sets/{set_id}/execute")
def execute_set(set_id: int, input_data: dict, service: RulesEngineService = Depends(get_service)) -> None:
    try:
        return service.execute_rule_set(set_id, input_data)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/executions")
def list_executions(rule_id: int | None = None, service: RulesEngineService = Depends(get_service)) -> None:
    return service.list_executions(rule_id=rule_id)


@router.get("/by-type/{rule_type}")
def rules_by_type(rule_type: str, service: RulesEngineService = Depends(get_service)) -> None:
    return service.rules_by_type(rule_type)
