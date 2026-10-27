import axios from 'axios';
import type { PressureUlcer, PressureUlcerCreateInput, PressureUlcerUpdateInput, PressureUlcerListParams, PressureUlcerListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const pressure_ulcerApi = {
  list: async (params: PressureUlcerListParams = {}): Promise<PressureUlcerListResponse> => {
    const { data } = await api.get('/pressure_ulcer', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PressureUlcer[]> => {
    const { data } = await api.get('/pressure_ulcer/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PressureUlcer> => {
    const { data } = await api.get(`/pressure_ulcer/${id}`);
    return data;
  },
  create: async (payload: PressureUlcerCreateInput): Promise<PressureUlcer> => {
    const { data } = await api.post('/pressure_ulcer', payload);
    return data;
  },
  update: async (id: number, payload: PressureUlcerUpdateInput): Promise<PressureUlcer> => {
    const { data } = await api.put(`/pressure_ulcer/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/pressure_ulcer/${id}`);
  },
  search: async (q: string): Promise<PressureUlcer[]> => {
    const { data } = await api.get('/pressure_ulcer/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/pressure_ulcer/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/pressure_ulcer/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PressureUlcer> => {
    const { data } = await api.post(`/pressure_ulcer/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PressureUlcer> => {
    const { data } = await api.post(`/pressure_ulcer/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PressureUlcer> => {
    const { data } = await api.post(`/pressure_ulcer/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PressureUlcer> => {
    const { data } = await api.post(`/pressure_ulcer/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default pressure_ulcerApi;
