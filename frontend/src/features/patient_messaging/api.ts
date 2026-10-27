import axios from 'axios';
import type { PatientMessaging, PatientMessagingCreateInput, PatientMessagingUpdateInput, PatientMessagingListParams, PatientMessagingListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const patient_messagingApi = {
  list: async (params: PatientMessagingListParams = {}): Promise<PatientMessagingListResponse> => {
    const { data } = await api.get('/patient_messaging', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PatientMessaging[]> => {
    const { data } = await api.get('/patient_messaging/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PatientMessaging> => {
    const { data } = await api.get(`/patient_messaging/${id}`);
    return data;
  },
  create: async (payload: PatientMessagingCreateInput): Promise<PatientMessaging> => {
    const { data } = await api.post('/patient_messaging', payload);
    return data;
  },
  update: async (id: number, payload: PatientMessagingUpdateInput): Promise<PatientMessaging> => {
    const { data } = await api.put(`/patient_messaging/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/patient_messaging/${id}`);
  },
  search: async (q: string): Promise<PatientMessaging[]> => {
    const { data } = await api.get('/patient_messaging/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/patient_messaging/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/patient_messaging/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PatientMessaging> => {
    const { data } = await api.post(`/patient_messaging/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PatientMessaging> => {
    const { data } = await api.post(`/patient_messaging/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PatientMessaging> => {
    const { data } = await api.post(`/patient_messaging/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PatientMessaging> => {
    const { data } = await api.post(`/patient_messaging/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default patient_messagingApi;
