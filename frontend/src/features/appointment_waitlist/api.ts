import axios from 'axios';
import type { AppointmentWaitlist, AppointmentWaitlistCreateInput, AppointmentWaitlistUpdateInput, AppointmentWaitlistListParams, AppointmentWaitlistListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const appointment_waitlistApi = {
  list: async (params: AppointmentWaitlistListParams = {}): Promise<AppointmentWaitlistListResponse> => {
    const { data } = await api.get('/appointment_waitlist', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<AppointmentWaitlist[]> => {
    const { data } = await api.get('/appointment_waitlist/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<AppointmentWaitlist> => {
    const { data } = await api.get(`/appointment_waitlist/${id}`);
    return data;
  },
  create: async (payload: AppointmentWaitlistCreateInput): Promise<AppointmentWaitlist> => {
    const { data } = await api.post('/appointment_waitlist', payload);
    return data;
  },
  update: async (id: number, payload: AppointmentWaitlistUpdateInput): Promise<AppointmentWaitlist> => {
    const { data } = await api.put(`/appointment_waitlist/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/appointment_waitlist/${id}`);
  },
  search: async (q: string): Promise<AppointmentWaitlist[]> => {
    const { data } = await api.get('/appointment_waitlist/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/appointment_waitlist/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/appointment_waitlist/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<AppointmentWaitlist> => {
    const { data } = await api.post(`/appointment_waitlist/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<AppointmentWaitlist> => {
    const { data } = await api.post(`/appointment_waitlist/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<AppointmentWaitlist> => {
    const { data } = await api.post(`/appointment_waitlist/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<AppointmentWaitlist> => {
    const { data } = await api.post(`/appointment_waitlist/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default appointment_waitlistApi;
