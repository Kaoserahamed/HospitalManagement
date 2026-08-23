import api from './axios'

export interface Department {
  id: string
  name: string
  description: string | null
  is_active: boolean
}

export interface DepartmentCreate {
  name: string
  description?: string
}

export interface DepartmentUpdate {
  name?: string
  description?: string
  is_active?: boolean
}

export interface DoctorAssignment {
  user_id: string
  department_id: string
  specialization?: string
}

export interface DoctorWithDepartment {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  is_active: boolean
  department_id: string | null
  department_name: string | null
  specialization: string | null
}

export const departmentAPI = {
  // Admin operations
  createDepartment: async (data: DepartmentCreate): Promise<Department> => {
    const response = await api.post<Department>('/departments', data)
    return response.data
  },

  updateDepartment: async (id: string, data: DepartmentUpdate): Promise<Department> => {
    const response = await api.put<Department>(`/departments/${id}`, data)
    return response.data
  },

  assignDoctor: async (data: DoctorAssignment): Promise<void> => {
    await api.post('/departments/assign-doctor', data)
  },

  removeAssignment: async (userId: string): Promise<void> => {
    await api.delete(`/departments/assign-doctor/${userId}`)
  },

  // Read operations
  getAllDepartments: async (activeOnly: boolean = false): Promise<Department[]> => {
    const response = await api.get<Department[]>('/departments', {
      params: { active_only: activeOnly }
    })
    return response.data
  },

  getDepartment: async (id: string): Promise<Department> => {
    const response = await api.get<Department>(`/departments/${id}`)
    return response.data
  },

  getAllDoctorsWithDepartments: async (): Promise<DoctorWithDepartment[]> => {
    const response = await api.get<DoctorWithDepartment[]>('/departments/doctors/all')
    return response.data
  },

  getMyDepartment: async (): Promise<Department | null> => {
    const response = await api.get<Department | null>('/departments/my-department/info')
    return response.data
  },
}
