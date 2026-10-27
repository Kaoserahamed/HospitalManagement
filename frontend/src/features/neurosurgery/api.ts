import axios from 'axios';
import type { Neurosurgery, NeurosurgeryCreateInput, NeurosurgeryUpdateInput, NeurosurgeryListParams, NeurosurgeryListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const neurosurgeryApi = {
  list: async (params: NeurosurgeryListParams = {}): Promise<NeurosurgeryListResponse> => {
    const { data } = await api.get('/neurosurgery', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Neurosurgery[]> => {
    const { data } = await api.get('/neurosurgery/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Neurosurgery> => {
    const { data } = await api.get(`/neurosurgery/${id}`);
    return data;
  },
  create: async (payload: NeurosurgeryCreateInput): Promise<Neurosurgery> => {
    const { data } = await api.post('/neurosurgery', payload);
    return data;
  },
  update: async (id: number, payload: NeurosurgeryUpdateInput): Promise<Neurosurgery> => {
    const { data } = await api.put(`/neurosurgery/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/neurosurgery/${id}`);
  },
  search: async (q: string): Promise<Neurosurgery[]> => {
    const { data } = await api.get('/neurosurgery/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/neurosurgery/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/neurosurgery/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Neurosurgery> => {
    const { data } = await api.post(`/neurosurgery/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Neurosurgery> => {
    const { data } = await api.post(`/neurosurgery/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Neurosurgery> => {
    const { data } = await api.post(`/neurosurgery/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Neurosurgery> => {
    const { data } = await api.post(`/neurosurgery/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default neurosurgeryApi;
