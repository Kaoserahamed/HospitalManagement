from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.patient import Patient


class PatientRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, patient_id: str) -> Patient | None:
        result = await self.session.execute(
            select(Patient).where(Patient.id == patient_id)
        )
        return result.scalars().first()

    async def get_by_nid(self, nid: str) -> Patient | None:
        """Get patient by NID"""
        result = await self.session.execute(
            select(Patient).where(Patient.nid == nid)
        )
        return result.scalars().first()

    async def get_by_phone(self, phone: str) -> Patient | None:
        """Get patient by phone"""
        result = await self.session.execute(
            select(Patient).where(Patient.phone == phone)
        )
        return result.scalars().first()

    async def get_all(self, active_only: bool = False) -> list[Patient]:
        """Get all patients"""
        query = select(Patient)
        if active_only:
            query = query.where(Patient.is_active == True)
        query = query.order_by(Patient.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def create(self, patient: Patient) -> Patient:
        self.session.add(patient)
        await self.session.commit()
        await self.session.refresh(patient)
        return patient

    async def update(self, patient: Patient) -> Patient:
        await self.session.commit()
        await self.session.refresh(patient)
        return patient

    async def delete(self, patient_id: str) -> bool:
        patient = await self.get_by_id(patient_id)
        if patient:
            await self.session.delete(patient)
            await self.session.commit()
            return True
        return False
