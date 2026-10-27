import axios from 'axios';
import type { StaffSatisfaction, StaffSatisfactionCreateInput, StaffSatisfactionUpdateInput, StaffSatisfactionListParams, StaffSatisfactionListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const staff_satisfactionApi = {
  list: async (params: StaffSatisfactionListParams = {}): Promise<StaffSatisfactionListResponse> => {
    const { data } = await api.get('/staff_satisfaction', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<StaffSatisfaction[]> => {
    const { data } = await api.get('/staff_satisfaction/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<StaffSatisfaction> => {
    const { data } = await api.get(`/staff_satisfaction/${id}`);
    return data;
  },
  create: async (payload: StaffSatisfactionCreateInput): Promise<StaffSatisfaction> => {
    const { data } = await api.post('/staff_satisfaction', payload);
    return data;
  },
  update: async (id: number, payload: StaffSatisfactionUpdateInput): Promise<StaffSatisfaction> => {
    const { data } = await api.put(`/staff_satisfaction/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/staff_satisfaction/${id}`);
  },
  search: async (q: string): Promise<StaffSatisfaction[]> => {
    const { data } = await api.get('/staff_satisfaction/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/staff_satisfaction/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/staff_satisfaction/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<StaffSatisfaction> => {
    const { data } = await api.post(`/staff_satisfaction/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<StaffSatisfaction> => {
    const { data } = await api.post(`/staff_satisfaction/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<StaffSatisfaction> => {
    const { data } = await api.post(`/staff_satisfaction/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<StaffSatisfaction> => {
    const { data } = await api.post(`/staff_satisfaction/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default staff_satisfactionApi;
