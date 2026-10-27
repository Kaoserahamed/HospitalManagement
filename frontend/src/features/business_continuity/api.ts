import axios from 'axios';
import type { BusinessContinuity, BusinessContinuityCreateInput, BusinessContinuityUpdateInput, BusinessContinuityListParams, BusinessContinuityListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const business_continuityApi = {
  list: async (params: BusinessContinuityListParams = {}): Promise<BusinessContinuityListResponse> => {
    const { data } = await api.get('/business_continuity', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<BusinessContinuity[]> => {
    const { data } = await api.get('/business_continuity/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<BusinessContinuity> => {
    const { data } = await api.get(`/business_continuity/${id}`);
    return data;
  },
  create: async (payload: BusinessContinuityCreateInput): Promise<BusinessContinuity> => {
    const { data } = await api.post('/business_continuity', payload);
    return data;
  },
  update: async (id: number, payload: BusinessContinuityUpdateInput): Promise<BusinessContinuity> => {
    const { data } = await api.put(`/business_continuity/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/business_continuity/${id}`);
  },
  search: async (q: string): Promise<BusinessContinuity[]> => {
    const { data } = await api.get('/business_continuity/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/business_continuity/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/business_continuity/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<BusinessContinuity> => {
    const { data } = await api.post(`/business_continuity/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<BusinessContinuity> => {
    const { data } = await api.post(`/business_continuity/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<BusinessContinuity> => {
    const { data } = await api.post(`/business_continuity/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<BusinessContinuity> => {
    const { data } = await api.post(`/business_continuity/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default business_continuityApi;
