import axios from 'axios';
import type { Endocrinology, EndocrinologyCreateInput, EndocrinologyUpdateInput, EndocrinologyListParams, EndocrinologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const endocrinologyApi = {
  list: async (params: EndocrinologyListParams = {}): Promise<EndocrinologyListResponse> => {
    const { data } = await api.get('/endocrinology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Endocrinology[]> => {
    const { data } = await api.get('/endocrinology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Endocrinology> => {
    const { data } = await api.get(`/endocrinology/${id}`);
    return data;
  },
  create: async (payload: EndocrinologyCreateInput): Promise<Endocrinology> => {
    const { data } = await api.post('/endocrinology', payload);
    return data;
  },
  update: async (id: number, payload: EndocrinologyUpdateInput): Promise<Endocrinology> => {
    const { data } = await api.put(`/endocrinology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/endocrinology/${id}`);
  },
  search: async (q: string): Promise<Endocrinology[]> => {
    const { data } = await api.get('/endocrinology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/endocrinology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/endocrinology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Endocrinology> => {
    const { data } = await api.post(`/endocrinology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Endocrinology> => {
    const { data } = await api.post(`/endocrinology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Endocrinology> => {
    const { data } = await api.post(`/endocrinology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Endocrinology> => {
    const { data } = await api.post(`/endocrinology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default endocrinologyApi;
