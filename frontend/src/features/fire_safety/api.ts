import axios from 'axios';
import type { FireSafety, FireSafetyCreateInput, FireSafetyUpdateInput, FireSafetyListParams, FireSafetyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const fire_safetyApi = {
  list: async (params: FireSafetyListParams = {}): Promise<FireSafetyListResponse> => {
    const { data } = await api.get('/fire_safety', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<FireSafety[]> => {
    const { data } = await api.get('/fire_safety/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<FireSafety> => {
    const { data } = await api.get(`/fire_safety/${id}`);
    return data;
  },
  create: async (payload: FireSafetyCreateInput): Promise<FireSafety> => {
    const { data } = await api.post('/fire_safety', payload);
    return data;
  },
  update: async (id: number, payload: FireSafetyUpdateInput): Promise<FireSafety> => {
    const { data } = await api.put(`/fire_safety/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/fire_safety/${id}`);
  },
  search: async (q: string): Promise<FireSafety[]> => {
    const { data } = await api.get('/fire_safety/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/fire_safety/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/fire_safety/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<FireSafety> => {
    const { data } = await api.post(`/fire_safety/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<FireSafety> => {
    const { data } = await api.post(`/fire_safety/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<FireSafety> => {
    const { data } = await api.post(`/fire_safety/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<FireSafety> => {
    const { data } = await api.post(`/fire_safety/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default fire_safetyApi;
