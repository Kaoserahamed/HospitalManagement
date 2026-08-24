from services.appointment_service import AppointmentService
from schemas.schemas import (
    AppointmentCreate, AppointmentUpdate, AppointmentStatusUpdate,
    AppointmentResponse, AppointmentWithDetails
)
from models.appointment import AppointmentStatus
from models.user import UserRole


class AppointmentController:
    def __init__(self, appointment_service: AppointmentService):
        self.appointment_service = appointment_service

    async def create_appointment(self, patient_id: str, data: AppointmentCreate) -> AppointmentResponse:
        appointment = await self.appointment_service.create_appointment(patient_id, data)
        return AppointmentResponse.model_validate(appointment)

    async def update_appointment(self, appointment_id: str, data: AppointmentUpdate) -> AppointmentResponse:
        appointment = await self.appointment_service.update_appointment(appointment_id, data)
        return AppointmentResponse.model_validate(appointment)

    async def update_status(self, appointment_id: str, data: AppointmentStatusUpdate) -> AppointmentResponse:
        appointment = await self.appointment_service.update_status(appointment_id, data)
        return AppointmentResponse.model_validate(appointment)

    async def cancel_appointment(self, appointment_id: str, user_id: str, user_role: UserRole) -> AppointmentResponse:
        appointment = await self.appointment_service.cancel_appointment(appointment_id, user_id, user_role)
        return AppointmentResponse.model_validate(appointment)

    async def get_patient_appointments(self, patient_id: str) -> list[AppointmentWithDetails]:
        return await self.appointment_service.get_patient_appointments(patient_id)

    async def get_doctor_appointments(self, doctor_id: str) -> list[AppointmentWithDetails]:
        return await self.appointment_service.get_doctor_appointments(doctor_id)

    async def get_all_appointments(self, status: AppointmentStatus | None = None) -> list[AppointmentWithDetails]:
        return await self.appointment_service.get_all_appointments(status=status)

    async def get_appointment(self, appointment_id: str) -> AppointmentResponse:
        appointment = await self.appointment_service.get_appointment(appointment_id)
        return AppointmentResponse.model_validate(appointment)
