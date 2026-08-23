from services.department_service import DepartmentService
from schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
    DoctorAssignmentRequest,
    DoctorProfileResponse,
    DoctorWithDepartment
)


class DepartmentController:
    def __init__(self, department_service: DepartmentService):
        self.department_service = department_service

    async def create_department(self, data: DepartmentCreate) -> DepartmentResponse:
        department = await self.department_service.create_department(data)
        return DepartmentResponse.model_validate(department)

    async def update_department(self, department_id: str, data: DepartmentUpdate) -> DepartmentResponse:
        department = await self.department_service.update_department(department_id, data)
        return DepartmentResponse.model_validate(department)

    async def get_all_departments(self, active_only: bool = False) -> list[DepartmentResponse]:
        departments = await self.department_service.get_all_departments(active_only=active_only)
        return [DepartmentResponse.model_validate(dept) for dept in departments]

    async def get_department(self, department_id: str) -> DepartmentResponse:
        department = await self.department_service.get_department(department_id)
        return DepartmentResponse.model_validate(department)

    async def assign_doctor(self, data: DoctorAssignmentRequest) -> DoctorProfileResponse:
        profile = await self.department_service.assign_doctor_to_department(data)
        return DoctorProfileResponse.model_validate(profile)

    async def remove_doctor_assignment(self, user_id: str) -> DoctorProfileResponse:
        profile = await self.department_service.remove_doctor_from_department(user_id)
        return DoctorProfileResponse.model_validate(profile)

    async def get_all_doctors_with_departments(self) -> list[DoctorWithDepartment]:
        return await self.department_service.get_all_doctors_with_departments()

    async def get_doctor_department(self, user_id: str) -> DepartmentResponse | None:
        department = await self.department_service.get_doctor_department(user_id)
        if not department:
            return None
        return DepartmentResponse.model_validate(department)
