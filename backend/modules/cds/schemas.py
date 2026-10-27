"""CDS Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CDSRuleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    rule_type: str
    condition: str
    action: str
    priority: int = 0
    is_active: bool = True


class CDSRuleCreate(CDSRuleBase):
    pass


class CDSRuleRead(CDSRuleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class CDSAlertBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    rule_id: Optional[int] = None
    alert_level: str = "info"
    message: str


class CDSAlertCreate(CDSAlertBase):
    pass


class CDSAlertRead(CDSAlertBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    acknowledged: bool = False
    acknowledged_by: Optional[int] = None
    created_at: Optional[datetime] = None


class DrugDoseRangeBase(BaseModel):
    medication: str = Field(..., min_length=1, max_length=120)
    min_dose: float = Field(..., ge=0)
    max_dose: float = Field(..., ge=0)
    unit: str = Field(..., min_length=1, max_length=40)
    age_min: Optional[int] = None
    age_max: Optional[int] = None


class DrugDoseRangeCreate(DrugDoseRangeBase):
    pass


class DrugDoseRangeRead(DrugDoseRangeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class CDSEvaluationRequest(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    medications: list[str] = []
    allergies: list[str] = []
    diagnoses: list[str] = []
    age: Optional[int] = None


class CDSEvaluationResult(BaseModel):
    patient_id: int
    alerts: list[dict] = []
    alert_count: int = 0
    has_critical: bool = False
