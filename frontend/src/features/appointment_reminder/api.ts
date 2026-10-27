import axios from 'axios';
import type { AppointmentReminder, AppointmentReminderCreateInput, AppointmentReminderUpdateInput, AppointmentReminderListParams, AppointmentReminderListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const appointment_reminderApi = {
  list: async (params: AppointmentReminderListParams = {}): Promise<AppointmentReminderListResponse> => {
    const { data } = await api.get('/appointment_reminder', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<AppointmentReminder[]> => {
    const { data } = await api.get('/appointment_reminder/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<AppointmentReminder> => {
    const { data } = await api.get(`/appointment_reminder/${id}`);
    return data;
  },
  create: async (payload: AppointmentReminderCreateInput): Promise<AppointmentReminder> => {
    const { data } = await api.post('/appointment_reminder', payload);
    return data;
  },
  update: async (id: number, payload: AppointmentReminderUpdateInput): Promise<AppointmentReminder> => {
    const { data } = await api.put(`/appointment_reminder/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/appointment_reminder/${id}`);
  },
  search: async (q: string): Promise<AppointmentReminder[]> => {
    const { data } = await api.get('/appointment_reminder/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/appointment_reminder/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/appointment_reminder/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<AppointmentReminder> => {
    const { data } = await api.post(`/appointment_reminder/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<AppointmentReminder> => {
    const { data } = await api.post(`/appointment_reminder/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<AppointmentReminder> => {
    const { data } = await api.post(`/appointment_reminder/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<AppointmentReminder> => {
    const { data } = await api.post(`/appointment_reminder/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default appointment_reminderApi;
