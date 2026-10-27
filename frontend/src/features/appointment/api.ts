import axios from 'axios';
import type { Appointment, AppointmentCreateInput, AppointmentUpdateInput, AppointmentListParams, AppointmentListResponse, Slot } from './types';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });

export const appointmentApi = {
  list: async (params: AppointmentListParams = {}): Promise<AppointmentListResponse> => {
    const { data } = await api.get('/appointments', { params });
    return data;
  },
  get: async (id: number): Promise<Appointment> => {
    const { data } = await api.get(`/appointments/${id}`);
    return data;
  },
  create: async (payload: AppointmentCreateInput): Promise<Appointment> => {
    const { data } = await api.post('/appointments', payload);
    return data;
  },
  update: async (id: number, payload: AppointmentUpdateInput): Promise<Appointment> => {
    const { data } = await api.put(`/appointments/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
  cancel: async (id: number, reason?: string): Promise<Appointment> => {
    const { data } = await api.post(`/appointments/${id}/cancel`, null, { params: { reason } });
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Appointment> => {
    const { data } = await api.post(`/appointments/${id}/complete`, null, { params: { notes } });
    return data;
  },
  checkConflict: async (payload: any): Promise<{ has_conflict: boolean; conflicts: Appointment[] }> => {
    const { data } = await api.post('/appointments/conflicts/check', payload);
    return data;
  },
  createSlot: async (payload: { doctor_id: number; start_time: string; end_time: string }): Promise<Slot> => {
    const { data } = await api.post('/appointments/slots', payload);
    return data;
  },
  availableSlots: async (doctor_id: number): Promise<Slot[]> => {
    const { data } = await api.get('/appointments/slots/available', { params: { doctor_id } });
    return data;
  },
};

export default appointmentApi;
