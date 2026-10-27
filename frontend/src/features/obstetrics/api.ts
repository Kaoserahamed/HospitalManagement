import axios from 'axios';
import type { Obstetrics, ObstetricsCreateInput, ObstetricsUpdateInput, ObstetricsListParams, ObstetricsListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const obstetricsApi = {
  list: async (params: ObstetricsListParams = {}): Promise<ObstetricsListResponse> => {
    const { data } = await api.get('/obstetrics', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Obstetrics[]> => {
    const { data } = await api.get('/obstetrics/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Obstetrics> => {
    const { data } = await api.get(`/obstetrics/${id}`);
    return data;
  },
  create: async (payload: ObstetricsCreateInput): Promise<Obstetrics> => {
    const { data } = await api.post('/obstetrics', payload);
    return data;
  },
  update: async (id: number, payload: ObstetricsUpdateInput): Promise<Obstetrics> => {
    const { data } = await api.put(`/obstetrics/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/obstetrics/${id}`);
  },
  search: async (q: string): Promise<Obstetrics[]> => {
    const { data } = await api.get('/obstetrics/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/obstetrics/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/obstetrics/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Obstetrics> => {
    const { data } = await api.post(`/obstetrics/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Obstetrics> => {
    const { data } = await api.post(`/obstetrics/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Obstetrics> => {
    const { data } = await api.post(`/obstetrics/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Obstetrics> => {
    const { data } = await api.post(`/obstetrics/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default obstetricsApi;
