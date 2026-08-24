import api from './axios'

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  department_id: string
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AppointmentWithDetails {
  id: string
  patient_id: string
  patient_name: string
  patient_email: string
  patient_phone: string | null
  doctor_id: string
  doctor_name: string
  doctor_email: string
  department_id: string
  department_name: string
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  reason: string | null
  notes: string | null
  created_at: string
}

export interface AppointmentCreate {
  doctor_id: string
  department_id: string
  appointment_date: string
  appointment_time: string
  reason?: string
}

export interface AppointmentStatusUpdate {
  status: AppointmentStatus
  notes?: string
}

export const appointmentAPI = {
  // Patient endpoints
  bookAppointment: async (data: AppointmentCreate): Promise<Appointment> => {
    const response = await api.post<Appointment>('/appointments', data)
    return response.data
  },

  getMyAppointments: async (): Promise<AppointmentWithDetails[]> => {
    const response = await api.get<AppointmentWithDetails[]>('/appointments/my-appointments')
    return response.data
  },

  cancelMyAppointment: async (appointmentId: string): Promise<Appointment> => {
    const response = await api.delete<Appointment>(`/appointments/${appointmentId}/cancel`)
    return response.data
  },

  // Doctor endpoints
  getMySchedule: async (): Promise<AppointmentWithDetails[]> => {
    const response = await api.get<AppointmentWithDetails[]>('/appointments/my-schedule')
    return response.data
  },

  updateStatus: async (appointmentId: string, data: AppointmentStatusUpdate): Promise<Appointment> => {
    const response = await api.patch<Appointment>(`/appointments/${appointmentId}/status`, data)
    return response.data
  },

  // Receptionist/Admin endpoints
  createAppointmentForPatient: async (patientId: string, data: AppointmentCreate): Promise<Appointment> => {
    const response = await api.post<Appointment>('/appointments/create', data, {
      params: { patient_id: patientId }
    })
    return response.data
  },

  getAllAppointments: async (status?: AppointmentStatus): Promise<AppointmentWithDetails[]> => {
    const response = await api.get<AppointmentWithDetails[]>('/appointments', {
      params: status ? { status } : {}
    })
    return response.data
  },

  getAppointment: async (appointmentId: string): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${appointmentId}`)
    return response.data
  },
}
