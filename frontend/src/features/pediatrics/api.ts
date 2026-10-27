import axios from 'axios';
import type { Pediatrics, PediatricsCreateInput, PediatricsUpdateInput, PediatricsListParams, PediatricsListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const pediatricsApi = {
  list: async (params: PediatricsListParams = {}): Promise<PediatricsListResponse> => {
    const { data } = await api.get('/pediatrics', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Pediatrics[]> => {
    const { data } = await api.get('/pediatrics/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Pediatrics> => {
    const { data } = await api.get(`/pediatrics/${id}`);
    return data;
  },
  create: async (payload: PediatricsCreateInput): Promise<Pediatrics> => {
    const { data } = await api.post('/pediatrics', payload);
    return data;
  },
  update: async (id: number, payload: PediatricsUpdateInput): Promise<Pediatrics> => {
    const { data } = await api.put(`/pediatrics/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/pediatrics/${id}`);
  },
  search: async (q: string): Promise<Pediatrics[]> => {
    const { data } = await api.get('/pediatrics/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/pediatrics/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/pediatrics/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Pediatrics> => {
    const { data } = await api.post(`/pediatrics/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Pediatrics> => {
    const { data } = await api.post(`/pediatrics/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Pediatrics> => {
    const { data } = await api.post(`/pediatrics/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Pediatrics> => {
    const { data } = await api.post(`/pediatrics/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default pediatricsApi;
