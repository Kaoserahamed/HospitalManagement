import axios from 'axios';
import type { Psychiatry, PsychiatryCreateInput, PsychiatryUpdateInput, PsychiatryListParams, PsychiatryListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const psychiatryApi = {
  list: async (params: PsychiatryListParams = {}): Promise<PsychiatryListResponse> => {
    const { data } = await api.get('/psychiatry', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Psychiatry[]> => {
    const { data } = await api.get('/psychiatry/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Psychiatry> => {
    const { data } = await api.get(`/psychiatry/${id}`);
    return data;
  },
  create: async (payload: PsychiatryCreateInput): Promise<Psychiatry> => {
    const { data } = await api.post('/psychiatry', payload);
    return data;
  },
  update: async (id: number, payload: PsychiatryUpdateInput): Promise<Psychiatry> => {
    const { data } = await api.put(`/psychiatry/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/psychiatry/${id}`);
  },
  search: async (q: string): Promise<Psychiatry[]> => {
    const { data } = await api.get('/psychiatry/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/psychiatry/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/psychiatry/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Psychiatry> => {
    const { data } = await api.post(`/psychiatry/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Psychiatry> => {
    const { data } = await api.post(`/psychiatry/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Psychiatry> => {
    const { data } = await api.post(`/psychiatry/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Psychiatry> => {
    const { data } = await api.post(`/psychiatry/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default psychiatryApi;
