import axios from 'axios';
import type { Pathology, PathologyCreateInput, PathologyUpdateInput, PathologyListParams, PathologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const pathologyApi = {
  list: async (params: PathologyListParams = {}): Promise<PathologyListResponse> => {
    const { data } = await api.get('/pathology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Pathology[]> => {
    const { data } = await api.get('/pathology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Pathology> => {
    const { data } = await api.get(`/pathology/${id}`);
    return data;
  },
  create: async (payload: PathologyCreateInput): Promise<Pathology> => {
    const { data } = await api.post('/pathology', payload);
    return data;
  },
  update: async (id: number, payload: PathologyUpdateInput): Promise<Pathology> => {
    const { data } = await api.put(`/pathology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/pathology/${id}`);
  },
  search: async (q: string): Promise<Pathology[]> => {
    const { data } = await api.get('/pathology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/pathology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/pathology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Pathology> => {
    const { data } = await api.post(`/pathology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Pathology> => {
    const { data } = await api.post(`/pathology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Pathology> => {
    const { data } = await api.post(`/pathology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Pathology> => {
    const { data } = await api.post(`/pathology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default pathologyApi;
