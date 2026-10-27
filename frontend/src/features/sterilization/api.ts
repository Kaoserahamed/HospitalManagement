import axios from 'axios';
import type { Sterilization, SterilizationCreateInput, SterilizationUpdateInput, SterilizationListParams, SterilizationListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const sterilizationApi = {
  list: async (params: SterilizationListParams = {}): Promise<SterilizationListResponse> => {
    const { data } = await api.get('/sterilization', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Sterilization[]> => {
    const { data } = await api.get('/sterilization/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Sterilization> => {
    const { data } = await api.get(`/sterilization/${id}`);
    return data;
  },
  create: async (payload: SterilizationCreateInput): Promise<Sterilization> => {
    const { data } = await api.post('/sterilization', payload);
    return data;
  },
  update: async (id: number, payload: SterilizationUpdateInput): Promise<Sterilization> => {
    const { data } = await api.put(`/sterilization/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/sterilization/${id}`);
  },
  search: async (q: string): Promise<Sterilization[]> => {
    const { data } = await api.get('/sterilization/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/sterilization/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/sterilization/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Sterilization> => {
    const { data } = await api.post(`/sterilization/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Sterilization> => {
    const { data } = await api.post(`/sterilization/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Sterilization> => {
    const { data } = await api.post(`/sterilization/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Sterilization> => {
    const { data } = await api.post(`/sterilization/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default sterilizationApi;
