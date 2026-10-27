import axios from 'axios';
import type { Pulmonology, PulmonologyCreateInput, PulmonologyUpdateInput, PulmonologyListParams, PulmonologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const pulmonologyApi = {
  list: async (params: PulmonologyListParams = {}): Promise<PulmonologyListResponse> => {
    const { data } = await api.get('/pulmonology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Pulmonology[]> => {
    const { data } = await api.get('/pulmonology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Pulmonology> => {
    const { data } = await api.get(`/pulmonology/${id}`);
    return data;
  },
  create: async (payload: PulmonologyCreateInput): Promise<Pulmonology> => {
    const { data } = await api.post('/pulmonology', payload);
    return data;
  },
  update: async (id: number, payload: PulmonologyUpdateInput): Promise<Pulmonology> => {
    const { data } = await api.put(`/pulmonology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/pulmonology/${id}`);
  },
  search: async (q: string): Promise<Pulmonology[]> => {
    const { data } = await api.get('/pulmonology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/pulmonology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/pulmonology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Pulmonology> => {
    const { data } = await api.post(`/pulmonology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Pulmonology> => {
    const { data } = await api.post(`/pulmonology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Pulmonology> => {
    const { data } = await api.post(`/pulmonology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Pulmonology> => {
    const { data } = await api.post(`/pulmonology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default pulmonologyApi;
