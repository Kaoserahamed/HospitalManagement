import axios from 'axios';
import type { CarePlan, CarePlanCreateInput, CarePlanUpdateInput, CarePlanListParams, CarePlanListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const care_planApi = {
  list: async (params: CarePlanListParams = {}): Promise<CarePlanListResponse> => {
    const { data } = await api.get('/care_plan', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<CarePlan[]> => {
    const { data } = await api.get('/care_plan/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<CarePlan> => {
    const { data } = await api.get(`/care_plan/${id}`);
    return data;
  },
  create: async (payload: CarePlanCreateInput): Promise<CarePlan> => {
    const { data } = await api.post('/care_plan', payload);
    return data;
  },
  update: async (id: number, payload: CarePlanUpdateInput): Promise<CarePlan> => {
    const { data } = await api.put(`/care_plan/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/care_plan/${id}`);
  },
  search: async (q: string): Promise<CarePlan[]> => {
    const { data } = await api.get('/care_plan/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/care_plan/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/care_plan/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<CarePlan> => {
    const { data } = await api.post(`/care_plan/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<CarePlan> => {
    const { data } = await api.post(`/care_plan/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<CarePlan> => {
    const { data } = await api.post(`/care_plan/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<CarePlan> => {
    const { data } = await api.post(`/care_plan/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default care_planApi;
