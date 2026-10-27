import axios from 'axios';
import type { Hospice, HospiceCreateInput, HospiceUpdateInput, HospiceListParams, HospiceListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const hospiceApi = {
  list: async (params: HospiceListParams = {}): Promise<HospiceListResponse> => {
    const { data } = await api.get('/hospice', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Hospice[]> => {
    const { data } = await api.get('/hospice/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Hospice> => {
    const { data } = await api.get(`/hospice/${id}`);
    return data;
  },
  create: async (payload: HospiceCreateInput): Promise<Hospice> => {
    const { data } = await api.post('/hospice', payload);
    return data;
  },
  update: async (id: number, payload: HospiceUpdateInput): Promise<Hospice> => {
    const { data } = await api.put(`/hospice/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/hospice/${id}`);
  },
  search: async (q: string): Promise<Hospice[]> => {
    const { data } = await api.get('/hospice/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/hospice/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/hospice/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Hospice> => {
    const { data } = await api.post(`/hospice/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Hospice> => {
    const { data } = await api.post(`/hospice/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Hospice> => {
    const { data } = await api.post(`/hospice/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Hospice> => {
    const { data } = await api.post(`/hospice/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default hospiceApi;
