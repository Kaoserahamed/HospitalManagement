import axios from 'axios';
import type { SportsMedicine, SportsMedicineCreateInput, SportsMedicineUpdateInput, SportsMedicineListParams, SportsMedicineListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const sports_medicineApi = {
  list: async (params: SportsMedicineListParams = {}): Promise<SportsMedicineListResponse> => {
    const { data } = await api.get('/sports_medicine', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<SportsMedicine[]> => {
    const { data } = await api.get('/sports_medicine/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<SportsMedicine> => {
    const { data } = await api.get(`/sports_medicine/${id}`);
    return data;
  },
  create: async (payload: SportsMedicineCreateInput): Promise<SportsMedicine> => {
    const { data } = await api.post('/sports_medicine', payload);
    return data;
  },
  update: async (id: number, payload: SportsMedicineUpdateInput): Promise<SportsMedicine> => {
    const { data } = await api.put(`/sports_medicine/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/sports_medicine/${id}`);
  },
  search: async (q: string): Promise<SportsMedicine[]> => {
    const { data } = await api.get('/sports_medicine/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/sports_medicine/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/sports_medicine/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<SportsMedicine> => {
    const { data } = await api.post(`/sports_medicine/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<SportsMedicine> => {
    const { data } = await api.post(`/sports_medicine/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<SportsMedicine> => {
    const { data } = await api.post(`/sports_medicine/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<SportsMedicine> => {
    const { data } = await api.post(`/sports_medicine/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default sports_medicineApi;
