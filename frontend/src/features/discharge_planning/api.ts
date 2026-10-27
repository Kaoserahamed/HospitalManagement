import axios from 'axios';
import type { DischargePlanning, DischargePlanningCreateInput, DischargePlanningUpdateInput, DischargePlanningListParams, DischargePlanningListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const discharge_planningApi = {
  list: async (params: DischargePlanningListParams = {}): Promise<DischargePlanningListResponse> => {
    const { data } = await api.get('/discharge_planning', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<DischargePlanning[]> => {
    const { data } = await api.get('/discharge_planning/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<DischargePlanning> => {
    const { data } = await api.get(`/discharge_planning/${id}`);
    return data;
  },
  create: async (payload: DischargePlanningCreateInput): Promise<DischargePlanning> => {
    const { data } = await api.post('/discharge_planning', payload);
    return data;
  },
  update: async (id: number, payload: DischargePlanningUpdateInput): Promise<DischargePlanning> => {
    const { data } = await api.put(`/discharge_planning/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/discharge_planning/${id}`);
  },
  search: async (q: string): Promise<DischargePlanning[]> => {
    const { data } = await api.get('/discharge_planning/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/discharge_planning/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/discharge_planning/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<DischargePlanning> => {
    const { data } = await api.post(`/discharge_planning/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<DischargePlanning> => {
    const { data } = await api.post(`/discharge_planning/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<DischargePlanning> => {
    const { data } = await api.post(`/discharge_planning/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<DischargePlanning> => {
    const { data } = await api.post(`/discharge_planning/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default discharge_planningApi;
