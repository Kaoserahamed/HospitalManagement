from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import and_, or_
from datetime import date, time
from models.appointment import Appointment, AppointmentStatus
from models.user import User
from models.department import Department


class AppointmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, appointment_id: str) -> Appointment | None:
        result = await self.session.execute(
            select(Appointment)
            .where(Appointment.id == appointment_id)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.doctor),
                selectinload(Appointment.department)
            )
        )
        return result.scalars().first()

    async def get_by_patient(self, patient_id: str) -> list[Appointment]:
        result = await self.session.execute(
            select(Appointment)
            .where(Appointment.patient_id == patient_id)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.doctor),
                selectinload(Appointment.department)
            )
            .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
        )
        return list(result.scalars().all())

    async def get_by_doctor(self, doctor_id: str) -> list[Appointment]:
        result = await self.session.execute(
            select(Appointment)
            .where(Appointment.doctor_id == doctor_id)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.department)
            )
            .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
        )
        return list(result.scalars().all())

    async def get_by_department(self, department_id: str) -> list[Appointment]:
        result = await self.session.execute(
            select(Appointment)
            .where(Appointment.department_id == department_id)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.doctor),
                selectinload(Appointment.department)
            )
            .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
        )
        return list(result.scalars().all())

    async def get_all(self, status: AppointmentStatus | None = None) -> list[Appointment]:
        query = select(Appointment).options(
            selectinload(Appointment.patient),
            selectinload(Appointment.doctor),
            selectinload(Appointment.department)
        )
        if status:
            query = query.where(Appointment.status == status)
        query = query.order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def check_conflict(
        self, 
        doctor_id: str, 
        appointment_date: date, 
        appointment_time: time,
        exclude_appointment_id: str | None = None
    ) -> Appointment | None:
        """Check if there's a conflicting appointment for the same doctor/time"""
        query = select(Appointment).where(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date == appointment_date,
                Appointment.appointment_time == appointment_time,
                Appointment.status.in_([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
            )
        )
        if exclude_appointment_id:
            query = query.where(Appointment.id != exclude_appointment_id)
        
        result = await self.session.execute(query)
        return result.scalars().first()

    async def create(self, appointment: Appointment) -> Appointment:
        self.session.add(appointment)
        await self.session.commit()
        # Reload with relationships
        result = await self.session.execute(
            select(Appointment)
            .where(Appointment.id == appointment.id)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.doctor),
                selectinload(Appointment.department)
            )
        )
        return result.scalars().first()

    async def update(self, appointment: Appointment) -> Appointment:
        await self.session.commit()
        # Reload with relationships
        result = await self.session.execute(
            select(Appointment)
            .where(Appointment.id == appointment.id)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.doctor),
                selectinload(Appointment.department)
            )
        )
        return result.scalars().first()

    async def delete(self, appointment_id: str) -> bool:
        appointment = await self.get_by_id(appointment_id)
        if appointment:
            await self.session.delete(appointment)
            await self.session.commit()
            return True
        return False
