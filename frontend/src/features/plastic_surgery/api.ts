import axios from 'axios';
import type { PlasticSurgery, PlasticSurgeryCreateInput, PlasticSurgeryUpdateInput, PlasticSurgeryListParams, PlasticSurgeryListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const plastic_surgeryApi = {
  list: async (params: PlasticSurgeryListParams = {}): Promise<PlasticSurgeryListResponse> => {
    const { data } = await api.get('/plastic_surgery', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PlasticSurgery[]> => {
    const { data } = await api.get('/plastic_surgery/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PlasticSurgery> => {
    const { data } = await api.get(`/plastic_surgery/${id}`);
    return data;
  },
  create: async (payload: PlasticSurgeryCreateInput): Promise<PlasticSurgery> => {
    const { data } = await api.post('/plastic_surgery', payload);
    return data;
  },
  update: async (id: number, payload: PlasticSurgeryUpdateInput): Promise<PlasticSurgery> => {
    const { data } = await api.put(`/plastic_surgery/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/plastic_surgery/${id}`);
  },
  search: async (q: string): Promise<PlasticSurgery[]> => {
    const { data } = await api.get('/plastic_surgery/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/plastic_surgery/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/plastic_surgery/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PlasticSurgery> => {
    const { data } = await api.post(`/plastic_surgery/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PlasticSurgery> => {
    const { data } = await api.post(`/plastic_surgery/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PlasticSurgery> => {
    const { data } = await api.post(`/plastic_surgery/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PlasticSurgery> => {
    const { data } = await api.post(`/plastic_surgery/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default plastic_surgeryApi;
