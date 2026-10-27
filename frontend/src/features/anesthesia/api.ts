import axios from 'axios';
import type { Anesthesia, AnesthesiaCreateInput, AnesthesiaUpdateInput, AnesthesiaListParams, AnesthesiaListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const anesthesiaApi = {
  list: async (params: AnesthesiaListParams = {}): Promise<AnesthesiaListResponse> => {
    const { data } = await api.get('/anesthesia', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Anesthesia[]> => {
    const { data } = await api.get('/anesthesia/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Anesthesia> => {
    const { data } = await api.get(`/anesthesia/${id}`);
    return data;
  },
  create: async (payload: AnesthesiaCreateInput): Promise<Anesthesia> => {
    const { data } = await api.post('/anesthesia', payload);
    return data;
  },
  update: async (id: number, payload: AnesthesiaUpdateInput): Promise<Anesthesia> => {
    const { data } = await api.put(`/anesthesia/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/anesthesia/${id}`);
  },
  search: async (q: string): Promise<Anesthesia[]> => {
    const { data } = await api.get('/anesthesia/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/anesthesia/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/anesthesia/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Anesthesia> => {
    const { data } = await api.post(`/anesthesia/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Anesthesia> => {
    const { data } = await api.post(`/anesthesia/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Anesthesia> => {
    const { data } = await api.post(`/anesthesia/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Anesthesia> => {
    const { data } = await api.post(`/anesthesia/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default anesthesiaApi;
