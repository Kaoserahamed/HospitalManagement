import api from './axios'

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface DoctorSchedule {
  id: string
  doctor_id: string
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  slot_duration: number
  is_active: boolean
}

export interface DoctorScheduleCreate {
  doctor_id: string
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  slot_duration: number
}

export interface DoctorScheduleUpdate {
  day_of_week?: DayOfWeek
  start_time?: string
  end_time?: string
  slot_duration?: number
  is_active?: boolean
}

export interface AvailableSlot {
  date: string
  time: string
  available: boolean
}

export const scheduleAPI = {
  // Admin endpoints
  createSchedule: async (data: DoctorScheduleCreate): Promise<DoctorSchedule> => {
    const response = await api.post<DoctorSchedule>('/schedules', data)
    return response.data
  },

  updateSchedule: async (scheduleId: string, data: DoctorScheduleUpdate): Promise<DoctorSchedule> => {
    const response = await api.put<DoctorSchedule>(`/schedules/${scheduleId}`, data)
    return response.data
  },

  deleteSchedule: async (scheduleId: string): Promise<void> => {
    await api.delete(`/schedules/${scheduleId}`)
  },

  getAllSchedules: async (): Promise<DoctorSchedule[]> => {
    const response = await api.get<DoctorSchedule[]>('/schedules/all')
    return response.data
  },

  // Doctor endpoints
  getMySchedule: async (): Promise<DoctorSchedule[]> => {
    const response = await api.get<DoctorSchedule[]>('/schedules/my-schedule')
    return response.data
  },

  // Public endpoints
  getDoctorSchedule: async (doctorId: string): Promise<DoctorSchedule[]> => {
    const response = await api.get<DoctorSchedule[]>(`/schedules/doctor/${doctorId}`)
    return response.data
  },

  getAvailability: async (doctorId: string, date: string): Promise<AvailableSlot[]> => {
    const response = await api.get<AvailableSlot[]>('/schedules/availability', {
      params: { doctor_id: doctorId, date }
    })
    return response.data
  },
}
