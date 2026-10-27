import axios from 'axios';
import type { Gynecology, GynecologyCreateInput, GynecologyUpdateInput, GynecologyListParams, GynecologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const gynecologyApi = {
  list: async (params: GynecologyListParams = {}): Promise<GynecologyListResponse> => {
    const { data } = await api.get('/gynecology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Gynecology[]> => {
    const { data } = await api.get('/gynecology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Gynecology> => {
    const { data } = await api.get(`/gynecology/${id}`);
    return data;
  },
  create: async (payload: GynecologyCreateInput): Promise<Gynecology> => {
    const { data } = await api.post('/gynecology', payload);
    return data;
  },
  update: async (id: number, payload: GynecologyUpdateInput): Promise<Gynecology> => {
    const { data } = await api.put(`/gynecology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/gynecology/${id}`);
  },
  search: async (q: string): Promise<Gynecology[]> => {
    const { data } = await api.get('/gynecology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/gynecology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/gynecology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Gynecology> => {
    const { data } = await api.post(`/gynecology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Gynecology> => {
    const { data } = await api.post(`/gynecology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Gynecology> => {
    const { data } = await api.post(`/gynecology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Gynecology> => {
    const { data } = await api.post(`/gynecology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default gynecologyApi;
