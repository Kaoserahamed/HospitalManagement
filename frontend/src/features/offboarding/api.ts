import axios from 'axios';
import type { Offboarding, OffboardingCreateInput, OffboardingUpdateInput, OffboardingListParams, OffboardingListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const offboardingApi = {
  list: async (params: OffboardingListParams = {}): Promise<OffboardingListResponse> => {
    const { data } = await api.get('/offboarding', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Offboarding[]> => {
    const { data } = await api.get('/offboarding/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Offboarding> => {
    const { data } = await api.get(`/offboarding/${id}`);
    return data;
  },
  create: async (payload: OffboardingCreateInput): Promise<Offboarding> => {
    const { data } = await api.post('/offboarding', payload);
    return data;
  },
  update: async (id: number, payload: OffboardingUpdateInput): Promise<Offboarding> => {
    const { data } = await api.put(`/offboarding/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/offboarding/${id}`);
  },
  search: async (q: string): Promise<Offboarding[]> => {
    const { data } = await api.get('/offboarding/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/offboarding/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/offboarding/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Offboarding> => {
    const { data } = await api.post(`/offboarding/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Offboarding> => {
    const { data } = await api.post(`/offboarding/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Offboarding> => {
    const { data } = await api.post(`/offboarding/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Offboarding> => {
    const { data } = await api.post(`/offboarding/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default offboardingApi;
