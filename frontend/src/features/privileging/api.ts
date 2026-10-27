import axios from 'axios';
import type { Privileging, PrivilegingCreateInput, PrivilegingUpdateInput, PrivilegingListParams, PrivilegingListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const privilegingApi = {
  list: async (params: PrivilegingListParams = {}): Promise<PrivilegingListResponse> => {
    const { data } = await api.get('/privileging', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Privileging[]> => {
    const { data } = await api.get('/privileging/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Privileging> => {
    const { data } = await api.get(`/privileging/${id}`);
    return data;
  },
  create: async (payload: PrivilegingCreateInput): Promise<Privileging> => {
    const { data } = await api.post('/privileging', payload);
    return data;
  },
  update: async (id: number, payload: PrivilegingUpdateInput): Promise<Privileging> => {
    const { data } = await api.put(`/privileging/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/privileging/${id}`);
  },
  search: async (q: string): Promise<Privileging[]> => {
    const { data } = await api.get('/privileging/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/privileging/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/privileging/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Privileging> => {
    const { data } = await api.post(`/privileging/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Privileging> => {
    const { data } = await api.post(`/privileging/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Privileging> => {
    const { data } = await api.post(`/privileging/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Privileging> => {
    const { data } = await api.post(`/privileging/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default privilegingApi;
