import axios from 'axios';
import type { Urology, UrologyCreateInput, UrologyUpdateInput, UrologyListParams, UrologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const urologyApi = {
  list: async (params: UrologyListParams = {}): Promise<UrologyListResponse> => {
    const { data } = await api.get('/urology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Urology[]> => {
    const { data } = await api.get('/urology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Urology> => {
    const { data } = await api.get(`/urology/${id}`);
    return data;
  },
  create: async (payload: UrologyCreateInput): Promise<Urology> => {
    const { data } = await api.post('/urology', payload);
    return data;
  },
  update: async (id: number, payload: UrologyUpdateInput): Promise<Urology> => {
    const { data } = await api.put(`/urology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/urology/${id}`);
  },
  search: async (q: string): Promise<Urology[]> => {
    const { data } = await api.get('/urology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/urology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/urology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Urology> => {
    const { data } = await api.post(`/urology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Urology> => {
    const { data } = await api.post(`/urology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Urology> => {
    const { data } = await api.post(`/urology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Urology> => {
    const { data } = await api.post(`/urology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default urologyApi;
