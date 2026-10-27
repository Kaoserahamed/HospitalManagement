import axios from 'axios';
import type { Rehabilitation, RehabilitationCreateInput, RehabilitationUpdateInput, RehabilitationListParams, RehabilitationListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const rehabilitationApi = {
  list: async (params: RehabilitationListParams = {}): Promise<RehabilitationListResponse> => {
    const { data } = await api.get('/rehabilitation', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Rehabilitation[]> => {
    const { data } = await api.get('/rehabilitation/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Rehabilitation> => {
    const { data } = await api.get(`/rehabilitation/${id}`);
    return data;
  },
  create: async (payload: RehabilitationCreateInput): Promise<Rehabilitation> => {
    const { data } = await api.post('/rehabilitation', payload);
    return data;
  },
  update: async (id: number, payload: RehabilitationUpdateInput): Promise<Rehabilitation> => {
    const { data } = await api.put(`/rehabilitation/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/rehabilitation/${id}`);
  },
  search: async (q: string): Promise<Rehabilitation[]> => {
    const { data } = await api.get('/rehabilitation/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/rehabilitation/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/rehabilitation/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Rehabilitation> => {
    const { data } = await api.post(`/rehabilitation/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Rehabilitation> => {
    const { data } = await api.post(`/rehabilitation/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Rehabilitation> => {
    const { data } = await api.post(`/rehabilitation/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Rehabilitation> => {
    const { data } = await api.post(`/rehabilitation/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default rehabilitationApi;
