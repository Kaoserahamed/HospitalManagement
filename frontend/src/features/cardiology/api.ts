import axios from 'axios';
import type { Cardiology, CardiologyCreateInput, CardiologyUpdateInput, CardiologyListParams, CardiologyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const cardiologyApi = {
  list: async (params: CardiologyListParams = {}): Promise<CardiologyListResponse> => {
    const { data } = await api.get('/cardiology', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Cardiology[]> => {
    const { data } = await api.get('/cardiology/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Cardiology> => {
    const { data } = await api.get(`/cardiology/${id}`);
    return data;
  },
  create: async (payload: CardiologyCreateInput): Promise<Cardiology> => {
    const { data } = await api.post('/cardiology', payload);
    return data;
  },
  update: async (id: number, payload: CardiologyUpdateInput): Promise<Cardiology> => {
    const { data } = await api.put(`/cardiology/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/cardiology/${id}`);
  },
  search: async (q: string): Promise<Cardiology[]> => {
    const { data } = await api.get('/cardiology/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/cardiology/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/cardiology/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Cardiology> => {
    const { data } = await api.post(`/cardiology/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Cardiology> => {
    const { data } = await api.post(`/cardiology/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Cardiology> => {
    const { data } = await api.post(`/cardiology/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Cardiology> => {
    const { data } = await api.post(`/cardiology/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default cardiologyApi;
