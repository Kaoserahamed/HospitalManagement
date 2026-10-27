import axios from 'axios';
import type { Transfusion, TransfusionCreateInput, TransfusionUpdateInput, TransfusionListParams, TransfusionListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const transfusionApi = {
  list: async (params: TransfusionListParams = {}): Promise<TransfusionListResponse> => {
    const { data } = await api.get('/transfusion', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Transfusion[]> => {
    const { data } = await api.get('/transfusion/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Transfusion> => {
    const { data } = await api.get(`/transfusion/${id}`);
    return data;
  },
  create: async (payload: TransfusionCreateInput): Promise<Transfusion> => {
    const { data } = await api.post('/transfusion', payload);
    return data;
  },
  update: async (id: number, payload: TransfusionUpdateInput): Promise<Transfusion> => {
    const { data } = await api.put(`/transfusion/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/transfusion/${id}`);
  },
  search: async (q: string): Promise<Transfusion[]> => {
    const { data } = await api.get('/transfusion/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/transfusion/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/transfusion/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Transfusion> => {
    const { data } = await api.post(`/transfusion/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Transfusion> => {
    const { data } = await api.post(`/transfusion/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Transfusion> => {
    const { data } = await api.post(`/transfusion/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Transfusion> => {
    const { data } = await api.post(`/transfusion/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default transfusionApi;
