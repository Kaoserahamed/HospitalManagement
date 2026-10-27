import axios from 'axios';
import type { InfectionControl, InfectionControlCreateInput, InfectionControlUpdateInput, InfectionControlListParams, InfectionControlListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const infection_controlApi = {
  list: async (params: InfectionControlListParams = {}): Promise<InfectionControlListResponse> => {
    const { data } = await api.get('/infection_control', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<InfectionControl[]> => {
    const { data } = await api.get('/infection_control/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<InfectionControl> => {
    const { data } = await api.get(`/infection_control/${id}`);
    return data;
  },
  create: async (payload: InfectionControlCreateInput): Promise<InfectionControl> => {
    const { data } = await api.post('/infection_control', payload);
    return data;
  },
  update: async (id: number, payload: InfectionControlUpdateInput): Promise<InfectionControl> => {
    const { data } = await api.put(`/infection_control/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/infection_control/${id}`);
  },
  search: async (q: string): Promise<InfectionControl[]> => {
    const { data } = await api.get('/infection_control/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/infection_control/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/infection_control/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<InfectionControl> => {
    const { data } = await api.post(`/infection_control/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<InfectionControl> => {
    const { data } = await api.post(`/infection_control/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<InfectionControl> => {
    const { data } = await api.post(`/infection_control/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<InfectionControl> => {
    const { data } = await api.post(`/infection_control/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default infection_controlApi;
