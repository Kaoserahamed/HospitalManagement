import axios from 'axios';
import type { Timekeeping, TimekeepingCreateInput, TimekeepingUpdateInput, TimekeepingListParams, TimekeepingListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const timekeepingApi = {
  list: async (params: TimekeepingListParams = {}): Promise<TimekeepingListResponse> => {
    const { data } = await api.get('/timekeeping', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Timekeeping[]> => {
    const { data } = await api.get('/timekeeping/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Timekeeping> => {
    const { data } = await api.get(`/timekeeping/${id}`);
    return data;
  },
  create: async (payload: TimekeepingCreateInput): Promise<Timekeeping> => {
    const { data } = await api.post('/timekeeping', payload);
    return data;
  },
  update: async (id: number, payload: TimekeepingUpdateInput): Promise<Timekeeping> => {
    const { data } = await api.put(`/timekeeping/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/timekeeping/${id}`);
  },
  search: async (q: string): Promise<Timekeeping[]> => {
    const { data } = await api.get('/timekeeping/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/timekeeping/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/timekeeping/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Timekeeping> => {
    const { data } = await api.post(`/timekeeping/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Timekeeping> => {
    const { data } = await api.post(`/timekeeping/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Timekeeping> => {
    const { data } = await api.post(`/timekeeping/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Timekeeping> => {
    const { data } = await api.post(`/timekeeping/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default timekeepingApi;
