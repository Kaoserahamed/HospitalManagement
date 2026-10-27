import axios from 'axios';
import type { Telehealth, TelehealthCreateInput, TelehealthUpdateInput, TelehealthListParams, TelehealthListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const telehealthApi = {
  list: async (params: TelehealthListParams = {}): Promise<TelehealthListResponse> => {
    const { data } = await api.get('/telehealth', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Telehealth[]> => {
    const { data } = await api.get('/telehealth/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Telehealth> => {
    const { data } = await api.get(`/telehealth/${id}`);
    return data;
  },
  create: async (payload: TelehealthCreateInput): Promise<Telehealth> => {
    const { data } = await api.post('/telehealth', payload);
    return data;
  },
  update: async (id: number, payload: TelehealthUpdateInput): Promise<Telehealth> => {
    const { data } = await api.put(`/telehealth/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/telehealth/${id}`);
  },
  search: async (q: string): Promise<Telehealth[]> => {
    const { data } = await api.get('/telehealth/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/telehealth/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/telehealth/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Telehealth> => {
    const { data } = await api.post(`/telehealth/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Telehealth> => {
    const { data } = await api.post(`/telehealth/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Telehealth> => {
    const { data } = await api.post(`/telehealth/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Telehealth> => {
    const { data } = await api.post(`/telehealth/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default telehealthApi;
