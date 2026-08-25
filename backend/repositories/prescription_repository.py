from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.prescription import Prescription


class PrescriptionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, prescription: Prescription) -> Prescription:
        self.session.add(prescription)
        await self.session.commit()
        await self.session.refresh(prescription)
        return prescription

    async def get_by_id(self, prescription_id: str) -> Prescription | None:
        stmt = select(Prescription).where(Prescription.id == prescription_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_appointment(self, appointment_id: str) -> list[Prescription]:
        stmt = select(Prescription).where(Prescription.appointment_id == appointment_id).order_by(Prescription.created_at.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_patient(self, patient_id: str) -> list[Prescription]:
        stmt = select(Prescription).where(Prescription.patient_id == patient_id).order_by(Prescription.created_at.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_doctor(self, doctor_id: str) -> list[Prescription]:
        stmt = select(Prescription).where(Prescription.doctor_id == doctor_id).order_by(Prescription.created_at.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update(self, prescription: Prescription) -> Prescription:
        await self.session.commit()
        await self.session.refresh(prescription)
        return prescription

    async def delete(self, prescription: Prescription) -> None:
        await self.session.delete(prescription)
        await self.session.commit()
