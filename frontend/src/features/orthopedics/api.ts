import axios from 'axios';
import type { Orthopedics, OrthopedicsCreateInput, OrthopedicsUpdateInput, OrthopedicsListParams, OrthopedicsListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const orthopedicsApi = {
  list: async (params: OrthopedicsListParams = {}): Promise<OrthopedicsListResponse> => {
    const { data } = await api.get('/orthopedics', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Orthopedics[]> => {
    const { data } = await api.get('/orthopedics/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Orthopedics> => {
    const { data } = await api.get(`/orthopedics/${id}`);
    return data;
  },
  create: async (payload: OrthopedicsCreateInput): Promise<Orthopedics> => {
    const { data } = await api.post('/orthopedics', payload);
    return data;
  },
  update: async (id: number, payload: OrthopedicsUpdateInput): Promise<Orthopedics> => {
    const { data } = await api.put(`/orthopedics/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/orthopedics/${id}`);
  },
  search: async (q: string): Promise<Orthopedics[]> => {
    const { data } = await api.get('/orthopedics/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/orthopedics/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/orthopedics/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Orthopedics> => {
    const { data } = await api.post(`/orthopedics/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Orthopedics> => {
    const { data } = await api.post(`/orthopedics/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Orthopedics> => {
    const { data } = await api.post(`/orthopedics/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Orthopedics> => {
    const { data } = await api.post(`/orthopedics/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default orthopedicsApi;
