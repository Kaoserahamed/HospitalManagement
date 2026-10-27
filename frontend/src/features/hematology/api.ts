import axios from 'axios';
import type { Hematology, HematologyCreateInput, HematologyUpdateInput, HematologyListParams, HematologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const hematologyApi = {
  list: async (params: HematologyListParams = {}): Promise<HematologyListResponse> => {
    const { data } = await api.get('/hematology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Hematology[]> => {
    const { data } = await api.get('/hematology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Hematology> => {
    const { data } = await api.get(`/hematology/${id}`);
    return data;
  },
  create: async (payload: HematologyCreateInput): Promise<Hematology> => {
    const { data } = await api.post('/hematology', payload);
    return data;
  },
  update: async (id: number, payload: HematologyUpdateInput): Promise<Hematology> => {
    const { data } = await api.put(`/hematology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/hematology/${id}`);
  },
  search: async (q: string): Promise<Hematology[]> => {
    const { data } = await api.get('/hematology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/hematology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/hematology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Hematology> => {
    const { data } = await api.post(`/hematology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Hematology> => {
    const { data } = await api.post(`/hematology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Hematology> => {
    const { data } = await api.post(`/hematology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Hematology> => {
    const { data } = await api.post(`/hematology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default hematologyApi;
