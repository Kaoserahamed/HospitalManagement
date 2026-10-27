import axios from 'axios';
import type { Procurement, ProcurementCreateInput, ProcurementUpdateInput, ProcurementListParams, ProcurementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const procurementApi = {
  list: async (params: ProcurementListParams = {}): Promise<ProcurementListResponse> => {
    const { data } = await api.get('/procurement', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Procurement[]> => {
    const { data } = await api.get('/procurement/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Procurement> => {
    const { data } = await api.get(`/procurement/${id}`);
    return data;
  },
  create: async (payload: ProcurementCreateInput): Promise<Procurement> => {
    const { data } = await api.post('/procurement', payload);
    return data;
  },
  update: async (id: number, payload: ProcurementUpdateInput): Promise<Procurement> => {
    const { data } = await api.put(`/procurement/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/procurement/${id}`);
  },
  search: async (q: string): Promise<Procurement[]> => {
    const { data } = await api.get('/procurement/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/procurement/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/procurement/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Procurement> => {
    const { data } = await api.post(`/procurement/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Procurement> => {
    const { data } = await api.post(`/procurement/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Procurement> => {
    const { data } = await api.post(`/procurement/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Procurement> => {
    const { data } = await api.post(`/procurement/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default procurementApi;
