"""HL7 v2 service."""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import HL7Repository
from .schemas import HL7MessageCreate, HL7ParseRequest


class HL7Service:
    def __init__(self, repository: HL7Repository | None = None) -> None:
        self.repository = repository or HL7Repository()

    def parse_message(self, raw: str) -> dict:
        if not raw or not raw.strip():
            raise ValidationError("empty message")
        segments = []
        lines = raw.strip().split("\n")
        for line in lines:
            line = line.strip()
            if not line:
                continue
            fields = line.split("|")
            segment_id = fields[0] if fields else ""
            segment = {"segment": segment_id, "fields": fields}
            segments.append(segment)
        message_type = "ADT"
        event = "A01"
        if segments and segments[0]["segment"] == "MSH":
            msh = segments[0]["fields"]
            if len(msh) > 8:
                msg_type_field = msh[8] if len(msh) > 8 else ""
                parts = msg_type_field.split("^")
                if len(parts) >= 1:
                    message_type = parts[0]
                if len(parts) >= 2:
                    event = parts[1]
        patient_id = None
        for seg in segments:
            if seg["segment"] == "PID" and len(seg["fields"]) > 3:
                pid_field = seg["fields"][3]
                patient_id = pid_field.split("^")[0] if "^" in pid_field else pid_field
        return {
            "message_type": message_type,
            "event": event,
            "segments": segments,
            "patient_id": patient_id,
            "valid": True,
        }

    def receive(self, data: HL7MessageCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        parsed = self.parse_message(payload["raw_message"])
        payload["message_type"] = payload.get("message_type", parsed["message_type"])
        payload["event"] = payload.get("event", parsed["event"])
        payload["parsed_json"] = json.dumps(parsed)
        record = self.repository.store(payload)
        default_bus.publish(DomainEvent(name="HL7MessageReceived", payload={"message_id": record["id"]}))
        return record

    def get(self, message_id: int) -> dict:
        record = self.repository.get(message_id)
        if record is None:
            raise NotFoundError("HL7Message", message_id)
        return record

    def process(self, message_id: int) -> dict:
        record = self.get(message_id)
        # simulate processing
        from datetime import datetime
        record = self.repository.update(message_id, {"status": "processed", "processed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="HL7MessageProcessed", payload={"message_id": message_id}))
        return record

    def fail(self, message_id: int, error: str) -> dict:
        record = self.repository.update(message_id, {"status": "failed", "error": error})
        default_bus.publish(DomainEvent(name="HL7MessageFailed", payload={"message_id": message_id, "error": error}))
        return record

    def list(self, params: PageParams, message_type: str | None = None, status: str | None = None) -> PageResult:
        return self.repository.list(params, message_type=message_type, status=status)

    def generate_ack(self, message_control_id: str, ack_code: str = "AA", text: str | None = None) -> str:
        lines = [
            "MSH|^~\\&|||||||" + datetime.utcnow().strftime("%Y%m%d%H%M%S") + "||ACK^" + (text or "") + "||P|2.5",
            f"MSA|{ack_code}|{message_control_id}|" + (text or ""),
        ]
        return "\n".join(lines)

    def handle_adt(self, patient_id: int, event: str) -> dict:
        return {"handled": True, "patient_id": patient_id, "event": event, "type": "ADT"}

    def handle_oru(self, patient_id: int, observations: list) -> dict:
        return {"handled": True, "patient_id": patient_id, "observation_count": len(observations), "type": "ORU"}

    def handle_orm(self, patient_id: int, orders: list) -> dict:
        return {"handled": True, "patient_id": patient_id, "order_count": len(orders), "type": "ORM"}

    def convert_patient_to_hl7(self, patient: dict) -> str:
        pid = patient.get("id", "")
        first = patient.get("first_name", "")
        last = patient.get("last_name", "")
        dob = patient.get("dob", "")
        gender = patient.get("gender", "U")
        return f"PID|1||{pid}^^^MRN||{last}^{first}||{dob}|{gender}"

    def convert_observation_to_hl7(self, obs: dict) -> str:
        return f"OBX|1|NM|{obs.get('test_name', '')}||{obs.get('value', '')}|{obs.get('unit', '')}"

    def count(self) -> int:
        return self.repository.count()

    def clear(self) -> None:
        self.repository.clear()
