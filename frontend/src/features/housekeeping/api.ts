import axios from 'axios';
import type { Housekeeping, HousekeepingCreateInput, HousekeepingUpdateInput, HousekeepingListParams, HousekeepingListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const housekeepingApi = {
  list: async (params: HousekeepingListParams = {}): Promise<HousekeepingListResponse> => {
    const { data } = await api.get('/housekeeping', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Housekeeping[]> => {
    const { data } = await api.get('/housekeeping/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Housekeeping> => {
    const { data } = await api.get(`/housekeeping/${id}`);
    return data;
  },
  create: async (payload: HousekeepingCreateInput): Promise<Housekeeping> => {
    const { data } = await api.post('/housekeeping', payload);
    return data;
  },
  update: async (id: number, payload: HousekeepingUpdateInput): Promise<Housekeeping> => {
    const { data } = await api.put(`/housekeeping/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/housekeeping/${id}`);
  },
  search: async (q: string): Promise<Housekeeping[]> => {
    const { data } = await api.get('/housekeeping/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/housekeeping/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/housekeeping/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Housekeeping> => {
    const { data } = await api.post(`/housekeeping/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Housekeeping> => {
    const { data } = await api.post(`/housekeeping/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Housekeeping> => {
    const { data } = await api.post(`/housekeeping/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Housekeeping> => {
    const { data } = await api.post(`/housekeeping/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default housekeepingApi;
