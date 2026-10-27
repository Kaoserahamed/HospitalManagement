import axios from 'axios';
import type { Gastroenterology, GastroenterologyCreateInput, GastroenterologyUpdateInput, GastroenterologyListParams, GastroenterologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const gastroenterologyApi = {
  list: async (params: GastroenterologyListParams = {}): Promise<GastroenterologyListResponse> => {
    const { data } = await api.get('/gastroenterology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Gastroenterology[]> => {
    const { data } = await api.get('/gastroenterology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Gastroenterology> => {
    const { data } = await api.get(`/gastroenterology/${id}`);
    return data;
  },
  create: async (payload: GastroenterologyCreateInput): Promise<Gastroenterology> => {
    const { data } = await api.post('/gastroenterology', payload);
    return data;
  },
  update: async (id: number, payload: GastroenterologyUpdateInput): Promise<Gastroenterology> => {
    const { data } = await api.put(`/gastroenterology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/gastroenterology/${id}`);
  },
  search: async (q: string): Promise<Gastroenterology[]> => {
    const { data } = await api.get('/gastroenterology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/gastroenterology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/gastroenterology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Gastroenterology> => {
    const { data } = await api.post(`/gastroenterology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Gastroenterology> => {
    const { data } = await api.post(`/gastroenterology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Gastroenterology> => {
    const { data } = await api.post(`/gastroenterology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Gastroenterology> => {
    const { data } = await api.post(`/gastroenterology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default gastroenterologyApi;
