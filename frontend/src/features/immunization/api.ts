import axios from 'axios';
import type { Immunization, ImmunizationCreateInput, ImmunizationUpdateInput, ImmunizationListParams, ImmunizationListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const immunizationApi = {
  list: async (params: ImmunizationListParams = {}): Promise<ImmunizationListResponse> => {
    const { data } = await api.get('/immunization', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Immunization[]> => {
    const { data } = await api.get('/immunization/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Immunization> => {
    const { data } = await api.get(`/immunization/${id}`);
    return data;
  },
  create: async (payload: ImmunizationCreateInput): Promise<Immunization> => {
    const { data } = await api.post('/immunization', payload);
    return data;
  },
  update: async (id: number, payload: ImmunizationUpdateInput): Promise<Immunization> => {
    const { data } = await api.put(`/immunization/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/immunization/${id}`);
  },
  search: async (q: string): Promise<Immunization[]> => {
    const { data } = await api.get('/immunization/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/immunization/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/immunization/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Immunization> => {
    const { data } = await api.post(`/immunization/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Immunization> => {
    const { data } = await api.post(`/immunization/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Immunization> => {
    const { data } = await api.post(`/immunization/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Immunization> => {
    const { data } = await api.post(`/immunization/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default immunizationApi;
