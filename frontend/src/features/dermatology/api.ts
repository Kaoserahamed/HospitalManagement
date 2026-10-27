import axios from 'axios';
import type { Dermatology, DermatologyCreateInput, DermatologyUpdateInput, DermatologyListParams, DermatologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const dermatologyApi = {
  list: async (params: DermatologyListParams = {}): Promise<DermatologyListResponse> => {
    const { data } = await api.get('/dermatology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Dermatology[]> => {
    const { data } = await api.get('/dermatology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Dermatology> => {
    const { data } = await api.get(`/dermatology/${id}`);
    return data;
  },
  create: async (payload: DermatologyCreateInput): Promise<Dermatology> => {
    const { data } = await api.post('/dermatology', payload);
    return data;
  },
  update: async (id: number, payload: DermatologyUpdateInput): Promise<Dermatology> => {
    const { data } = await api.put(`/dermatology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/dermatology/${id}`);
  },
  search: async (q: string): Promise<Dermatology[]> => {
    const { data } = await api.get('/dermatology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/dermatology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/dermatology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Dermatology> => {
    const { data } = await api.post(`/dermatology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Dermatology> => {
    const { data } = await api.post(`/dermatology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Dermatology> => {
    const { data } = await api.post(`/dermatology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Dermatology> => {
    const { data } = await api.post(`/dermatology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default dermatologyApi;
