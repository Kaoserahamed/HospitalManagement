import axios from 'axios';
import type { Ophthalmology, OphthalmologyCreateInput, OphthalmologyUpdateInput, OphthalmologyListParams, OphthalmologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const ophthalmologyApi = {
  list: async (params: OphthalmologyListParams = {}): Promise<OphthalmologyListResponse> => {
    const { data } = await api.get('/ophthalmology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Ophthalmology[]> => {
    const { data } = await api.get('/ophthalmology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Ophthalmology> => {
    const { data } = await api.get(`/ophthalmology/${id}`);
    return data;
  },
  create: async (payload: OphthalmologyCreateInput): Promise<Ophthalmology> => {
    const { data } = await api.post('/ophthalmology', payload);
    return data;
  },
  update: async (id: number, payload: OphthalmologyUpdateInput): Promise<Ophthalmology> => {
    const { data } = await api.put(`/ophthalmology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/ophthalmology/${id}`);
  },
  search: async (q: string): Promise<Ophthalmology[]> => {
    const { data } = await api.get('/ophthalmology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/ophthalmology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/ophthalmology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Ophthalmology> => {
    const { data } = await api.post(`/ophthalmology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Ophthalmology> => {
    const { data } = await api.post(`/ophthalmology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Ophthalmology> => {
    const { data } = await api.post(`/ophthalmology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Ophthalmology> => {
    const { data } = await api.post(`/ophthalmology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default ophthalmologyApi;
