import axios from 'axios';
import type { Anesthesiology, AnesthesiologyCreateInput, AnesthesiologyUpdateInput, AnesthesiologyListParams, AnesthesiologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const anesthesiologyApi = {
  list: async (params: AnesthesiologyListParams = {}): Promise<AnesthesiologyListResponse> => {
    const { data } = await api.get('/anesthesiology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Anesthesiology[]> => {
    const { data } = await api.get('/anesthesiology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Anesthesiology> => {
    const { data } = await api.get(`/anesthesiology/${id}`);
    return data;
  },
  create: async (payload: AnesthesiologyCreateInput): Promise<Anesthesiology> => {
    const { data } = await api.post('/anesthesiology', payload);
    return data;
  },
  update: async (id: number, payload: AnesthesiologyUpdateInput): Promise<Anesthesiology> => {
    const { data } = await api.put(`/anesthesiology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/anesthesiology/${id}`);
  },
  search: async (q: string): Promise<Anesthesiology[]> => {
    const { data } = await api.get('/anesthesiology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/anesthesiology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/anesthesiology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Anesthesiology> => {
    const { data } = await api.post(`/anesthesiology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Anesthesiology> => {
    const { data } = await api.post(`/anesthesiology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Anesthesiology> => {
    const { data } = await api.post(`/anesthesiology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Anesthesiology> => {
    const { data } = await api.post(`/anesthesiology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default anesthesiologyApi;
