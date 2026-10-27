import axios from 'axios';
import type { Nephrology, NephrologyCreateInput, NephrologyUpdateInput, NephrologyListParams, NephrologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const nephrologyApi = {
  list: async (params: NephrologyListParams = {}): Promise<NephrologyListResponse> => {
    const { data } = await api.get('/nephrology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Nephrology[]> => {
    const { data } = await api.get('/nephrology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Nephrology> => {
    const { data } = await api.get(`/nephrology/${id}`);
    return data;
  },
  create: async (payload: NephrologyCreateInput): Promise<Nephrology> => {
    const { data } = await api.post('/nephrology', payload);
    return data;
  },
  update: async (id: number, payload: NephrologyUpdateInput): Promise<Nephrology> => {
    const { data } = await api.put(`/nephrology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/nephrology/${id}`);
  },
  search: async (q: string): Promise<Nephrology[]> => {
    const { data } = await api.get('/nephrology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/nephrology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/nephrology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Nephrology> => {
    const { data } = await api.post(`/nephrology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Nephrology> => {
    const { data } = await api.post(`/nephrology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Nephrology> => {
    const { data } = await api.post(`/nephrology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Nephrology> => {
    const { data } = await api.post(`/nephrology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default nephrologyApi;
