from fastapi import HTTPException, status
from repositories.department_repository import DepartmentRepository
from repositories.doctor_repository import DoctorRepository
from repositories.user_repository import UserRepository
from schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DoctorAssignmentRequest,
    DoctorWithDepartment
)
from models.department import Department
from models.doctor import DoctorProfile
from models.user import UserRole


class DepartmentService:
    def __init__(
        self,
        department_repo: DepartmentRepository,
        doctor_repo: DoctorRepository,
        user_repo: UserRepository
    ):
        self.department_repo = department_repo
        self.doctor_repo = doctor_repo
        self.user_repo = user_repo

    async def create_department(self, data: DepartmentCreate) -> Department:
        """Create a new department"""
        # Check for duplicate name
        existing = await self.department_repo.get_by_name(data.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department with this name already exists"
            )

        department = Department(
            name=data.name,
            description=data.description,
            is_active=True
        )
        return await self.department_repo.create(department)

    async def update_department(self, department_id: str, data: DepartmentUpdate) -> Department:
        """Update an existing department"""
        department = await self.department_repo.get_by_id(department_id)
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )

        # Check for duplicate name if name is being updated
        if data.name and data.name != department.name:
            existing = await self.department_repo.get_by_name(data.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Department with this name already exists"
                )
            department.name = data.name

        if data.description is not None:
            department.description = data.description

        if data.is_active is not None:
            department.is_active = data.is_active

        return await self.department_repo.update(department)

    async def get_all_departments(self, active_only: bool = False) -> list[Department]:
        """Get all departments"""
        return await self.department_repo.get_all(active_only=active_only)

    async def get_department(self, department_id: str) -> Department:
        """Get a specific department"""
        department = await self.department_repo.get_by_id(department_id)
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )
        return department

    async def assign_doctor_to_department(self, data: DoctorAssignmentRequest) -> DoctorProfile:
        """Assign a doctor to a department"""
        # Verify user exists and is a doctor
        user = await self.user_repo.get_by_id(data.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if user.role != UserRole.DOCTOR:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not a doctor"
            )

        # Verify department exists and is active
        department = await self.department_repo.get_by_id(data.department_id)
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )
        if not department.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot assign doctor to inactive department"
            )

        # Check if doctor profile already exists
        doctor_profile = await self.doctor_repo.get_by_user_id(data.user_id)
        if doctor_profile:
            # Update existing profile
            doctor_profile.department_id = data.department_id
            if data.specialization:
                doctor_profile.specialization = data.specialization
            return await self.doctor_repo.update(doctor_profile)
        else:
            # Create new profile
            doctor_profile = DoctorProfile(
                user_id=data.user_id,
                department_id=data.department_id,
                specialization=data.specialization
            )
            return await self.doctor_repo.create(doctor_profile)

    async def remove_doctor_from_department(self, user_id: str) -> DoctorProfile:
        """Remove a doctor from their department"""
        doctor_profile = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Doctor profile not found"
            )

        doctor_profile.department_id = None
        return await self.doctor_repo.update(doctor_profile)

    async def get_all_doctors_with_departments(self) -> list[DoctorWithDepartment]:
        """Get all doctors with their department information"""
        doctors_data = await self.doctor_repo.get_all_doctors()
        
        result = []
        for user, profile, department in doctors_data:
            department_name = None
            department_id = None
            specialization = None

            if profile:
                department_id = profile.department_id
                specialization = profile.specialization
            
            if department:
                department_name = department.name

            result.append(DoctorWithDepartment(
                id=user.id,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                phone=user.phone,
                is_active=user.is_active,
                department_id=department_id,
                department_name=department_name,
                specialization=specialization
            ))

        return result

    async def get_doctor_department(self, user_id: str) -> Department | None:
        """Get a doctor's assigned department"""
        doctor_profile = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor_profile or not doctor_profile.department_id:
            return None
        
        return await self.department_repo.get_by_id(doctor_profile.department_id)
