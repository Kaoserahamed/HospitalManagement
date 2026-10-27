import axios from 'axios';
import type { Oncology, OncologyCreateInput, OncologyUpdateInput, OncologyListParams, OncologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const oncologyApi = {
  list: async (params: OncologyListParams = {}): Promise<OncologyListResponse> => {
    const { data } = await api.get('/oncology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Oncology[]> => {
    const { data } = await api.get('/oncology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Oncology> => {
    const { data } = await api.get(`/oncology/${id}`);
    return data;
  },
  create: async (payload: OncologyCreateInput): Promise<Oncology> => {
    const { data } = await api.post('/oncology', payload);
    return data;
  },
  update: async (id: number, payload: OncologyUpdateInput): Promise<Oncology> => {
    const { data } = await api.put(`/oncology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/oncology/${id}`);
  },
  search: async (q: string): Promise<Oncology[]> => {
    const { data } = await api.get('/oncology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/oncology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/oncology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Oncology> => {
    const { data } = await api.post(`/oncology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Oncology> => {
    const { data } = await api.post(`/oncology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Oncology> => {
    const { data } = await api.post(`/oncology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Oncology> => {
    const { data } = await api.post(`/oncology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default oncologyApi;
