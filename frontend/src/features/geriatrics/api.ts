import axios from 'axios';
import type { Geriatrics, GeriatricsCreateInput, GeriatricsUpdateInput, GeriatricsListParams, GeriatricsListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const geriatricsApi = {
  list: async (params: GeriatricsListParams = {}): Promise<GeriatricsListResponse> => {
    const { data } = await api.get('/geriatrics', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Geriatrics[]> => {
    const { data } = await api.get('/geriatrics/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Geriatrics> => {
    const { data } = await api.get(`/geriatrics/${id}`);
    return data;
  },
  create: async (payload: GeriatricsCreateInput): Promise<Geriatrics> => {
    const { data } = await api.post('/geriatrics', payload);
    return data;
  },
  update: async (id: number, payload: GeriatricsUpdateInput): Promise<Geriatrics> => {
    const { data } = await api.put(`/geriatrics/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/geriatrics/${id}`);
  },
  search: async (q: string): Promise<Geriatrics[]> => {
    const { data } = await api.get('/geriatrics/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/geriatrics/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/geriatrics/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Geriatrics> => {
    const { data } = await api.post(`/geriatrics/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Geriatrics> => {
    const { data } = await api.post(`/geriatrics/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Geriatrics> => {
    const { data } = await api.post(`/geriatrics/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Geriatrics> => {
    const { data } = await api.post(`/geriatrics/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default geriatricsApi;
