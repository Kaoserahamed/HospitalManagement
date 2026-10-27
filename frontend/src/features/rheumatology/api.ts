import axios from 'axios';
import type { Rheumatology, RheumatologyCreateInput, RheumatologyUpdateInput, RheumatologyListParams, RheumatologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const rheumatologyApi = {
  list: async (params: RheumatologyListParams = {}): Promise<RheumatologyListResponse> => {
    const { data } = await api.get('/rheumatology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Rheumatology[]> => {
    const { data } = await api.get('/rheumatology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Rheumatology> => {
    const { data } = await api.get(`/rheumatology/${id}`);
    return data;
  },
  create: async (payload: RheumatologyCreateInput): Promise<Rheumatology> => {
    const { data } = await api.post('/rheumatology', payload);
    return data;
  },
  update: async (id: number, payload: RheumatologyUpdateInput): Promise<Rheumatology> => {
    const { data } = await api.put(`/rheumatology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/rheumatology/${id}`);
  },
  search: async (q: string): Promise<Rheumatology[]> => {
    const { data } = await api.get('/rheumatology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/rheumatology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/rheumatology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Rheumatology> => {
    const { data } = await api.post(`/rheumatology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Rheumatology> => {
    const { data } = await api.post(`/rheumatology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Rheumatology> => {
    const { data } = await api.post(`/rheumatology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Rheumatology> => {
    const { data } = await api.post(`/rheumatology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default rheumatologyApi;
