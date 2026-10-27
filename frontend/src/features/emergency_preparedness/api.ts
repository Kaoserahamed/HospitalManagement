import axios from 'axios';
import type { EmergencyPreparedness, EmergencyPreparednessCreateInput, EmergencyPreparednessUpdateInput, EmergencyPreparednessListParams, EmergencyPreparednessListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const emergency_preparednessApi = {
  list: async (params: EmergencyPreparednessListParams = {}): Promise<EmergencyPreparednessListResponse> => {
    const { data } = await api.get('/emergency_preparedness', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<EmergencyPreparedness[]> => {
    const { data } = await api.get('/emergency_preparedness/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<EmergencyPreparedness> => {
    const { data } = await api.get(`/emergency_preparedness/${id}`);
    return data;
  },
  create: async (payload: EmergencyPreparednessCreateInput): Promise<EmergencyPreparedness> => {
    const { data } = await api.post('/emergency_preparedness', payload);
    return data;
  },
  update: async (id: number, payload: EmergencyPreparednessUpdateInput): Promise<EmergencyPreparedness> => {
    const { data } = await api.put(`/emergency_preparedness/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/emergency_preparedness/${id}`);
  },
  search: async (q: string): Promise<EmergencyPreparedness[]> => {
    const { data } = await api.get('/emergency_preparedness/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/emergency_preparedness/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/emergency_preparedness/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<EmergencyPreparedness> => {
    const { data } = await api.post(`/emergency_preparedness/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<EmergencyPreparedness> => {
    const { data } = await api.post(`/emergency_preparedness/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<EmergencyPreparedness> => {
    const { data } = await api.post(`/emergency_preparedness/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<EmergencyPreparedness> => {
    const { data } = await api.post(`/emergency_preparedness/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default emergency_preparednessApi;
