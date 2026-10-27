import axios from 'axios';
import type { CardiacSurgery, CardiacSurgeryCreateInput, CardiacSurgeryUpdateInput, CardiacSurgeryListParams, CardiacSurgeryListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const cardiac_surgeryApi = {
  list: async (params: CardiacSurgeryListParams = {}): Promise<CardiacSurgeryListResponse> => {
    const { data } = await api.get('/cardiac_surgery', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<CardiacSurgery[]> => {
    const { data } = await api.get('/cardiac_surgery/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<CardiacSurgery> => {
    const { data } = await api.get(`/cardiac_surgery/${id}`);
    return data;
  },
  create: async (payload: CardiacSurgeryCreateInput): Promise<CardiacSurgery> => {
    const { data } = await api.post('/cardiac_surgery', payload);
    return data;
  },
  update: async (id: number, payload: CardiacSurgeryUpdateInput): Promise<CardiacSurgery> => {
    const { data } = await api.put(`/cardiac_surgery/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/cardiac_surgery/${id}`);
  },
  search: async (q: string): Promise<CardiacSurgery[]> => {
    const { data } = await api.get('/cardiac_surgery/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/cardiac_surgery/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/cardiac_surgery/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<CardiacSurgery> => {
    const { data } = await api.post(`/cardiac_surgery/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<CardiacSurgery> => {
    const { data } = await api.post(`/cardiac_surgery/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<CardiacSurgery> => {
    const { data } = await api.post(`/cardiac_surgery/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<CardiacSurgery> => {
    const { data } = await api.post(`/cardiac_surgery/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default cardiac_surgeryApi;
