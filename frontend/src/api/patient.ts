import api from './axios'

/** Patient record as returned by the staff patients listing. */
export interface PatientUser {
  id: string
  nid: string
  first_name: string
  last_name: string
  phone: string
  is_active: boolean
}

export const patientAPI = {
  /** Receptionist/admin listing (paginated server-side). */
  getAllPatients: async (activeOnly = false): Promise<PatientUser[]> => {
    const response = await api.get<PatientUser[]>('/patients', {
      params: activeOnly ? { active_only: true } : {},
    })
    return response.data
  },
}
