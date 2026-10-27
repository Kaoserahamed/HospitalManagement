import axios from 'axios';
import type { CardiacRehab, CardiacRehabCreateInput, CardiacRehabUpdateInput, CardiacRehabListParams, CardiacRehabListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const cardiac_rehabApi = {
  list: async (params: CardiacRehabListParams = {}): Promise<CardiacRehabListResponse> => {
    const { data } = await api.get('/cardiac_rehab', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<CardiacRehab[]> => {
    const { data } = await api.get('/cardiac_rehab/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<CardiacRehab> => {
    const { data } = await api.get(`/cardiac_rehab/${id}`);
    return data;
  },
  create: async (payload: CardiacRehabCreateInput): Promise<CardiacRehab> => {
    const { data } = await api.post('/cardiac_rehab', payload);
    return data;
  },
  update: async (id: number, payload: CardiacRehabUpdateInput): Promise<CardiacRehab> => {
    const { data } = await api.put(`/cardiac_rehab/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/cardiac_rehab/${id}`);
  },
  search: async (q: string): Promise<CardiacRehab[]> => {
    const { data } = await api.get('/cardiac_rehab/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/cardiac_rehab/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/cardiac_rehab/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<CardiacRehab> => {
    const { data } = await api.post(`/cardiac_rehab/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<CardiacRehab> => {
    const { data } = await api.post(`/cardiac_rehab/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<CardiacRehab> => {
    const { data } = await api.post(`/cardiac_rehab/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<CardiacRehab> => {
    const { data } = await api.post(`/cardiac_rehab/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default cardiac_rehabApi;
