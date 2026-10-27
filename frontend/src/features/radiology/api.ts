import axios from 'axios';
import type { Radiology, RadiologyCreateInput, RadiologyUpdateInput, RadiologyListParams, RadiologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const radiologyApi = {
  list: async (params: RadiologyListParams = {}): Promise<RadiologyListResponse> => {
    const { data } = await api.get('/radiology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Radiology[]> => {
    const { data } = await api.get('/radiology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Radiology> => {
    const { data } = await api.get(`/radiology/${id}`);
    return data;
  },
  create: async (payload: RadiologyCreateInput): Promise<Radiology> => {
    const { data } = await api.post('/radiology', payload);
    return data;
  },
  update: async (id: number, payload: RadiologyUpdateInput): Promise<Radiology> => {
    const { data } = await api.put(`/radiology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/radiology/${id}`);
  },
  search: async (q: string): Promise<Radiology[]> => {
    const { data } = await api.get('/radiology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/radiology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/radiology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Radiology> => {
    const { data } = await api.post(`/radiology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Radiology> => {
    const { data } = await api.post(`/radiology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Radiology> => {
    const { data } = await api.post(`/radiology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Radiology> => {
    const { data } = await api.post(`/radiology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default radiologyApi;
