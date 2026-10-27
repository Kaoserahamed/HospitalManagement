import axios from 'axios';
import type { Neonatology, NeonatologyCreateInput, NeonatologyUpdateInput, NeonatologyListParams, NeonatologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const neonatologyApi = {
  list: async (params: NeonatologyListParams = {}): Promise<NeonatologyListResponse> => {
    const { data } = await api.get('/neonatology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Neonatology[]> => {
    const { data } = await api.get('/neonatology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Neonatology> => {
    const { data } = await api.get(`/neonatology/${id}`);
    return data;
  },
  create: async (payload: NeonatologyCreateInput): Promise<Neonatology> => {
    const { data } = await api.post('/neonatology', payload);
    return data;
  },
  update: async (id: number, payload: NeonatologyUpdateInput): Promise<Neonatology> => {
    const { data } = await api.put(`/neonatology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/neonatology/${id}`);
  },
  search: async (q: string): Promise<Neonatology[]> => {
    const { data } = await api.get('/neonatology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/neonatology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/neonatology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Neonatology> => {
    const { data } = await api.post(`/neonatology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Neonatology> => {
    const { data } = await api.post(`/neonatology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Neonatology> => {
    const { data } = await api.post(`/neonatology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Neonatology> => {
    const { data } = await api.post(`/neonatology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default neonatologyApi;
