import axios from 'axios';
import type { Neurology, NeurologyCreateInput, NeurologyUpdateInput, NeurologyListParams, NeurologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const neurologyApi = {
  list: async (params: NeurologyListParams = {}): Promise<NeurologyListResponse> => {
    const { data } = await api.get('/neurology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Neurology[]> => {
    const { data } = await api.get('/neurology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Neurology> => {
    const { data } = await api.get(`/neurology/${id}`);
    return data;
  },
  create: async (payload: NeurologyCreateInput): Promise<Neurology> => {
    const { data } = await api.post('/neurology', payload);
    return data;
  },
  update: async (id: number, payload: NeurologyUpdateInput): Promise<Neurology> => {
    const { data } = await api.put(`/neurology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/neurology/${id}`);
  },
  search: async (q: string): Promise<Neurology[]> => {
    const { data } = await api.get('/neurology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/neurology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/neurology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Neurology> => {
    const { data } = await api.post(`/neurology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Neurology> => {
    const { data } = await api.post(`/neurology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Neurology> => {
    const { data } = await api.post(`/neurology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Neurology> => {
    const { data } = await api.post(`/neurology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default neurologyApi;
