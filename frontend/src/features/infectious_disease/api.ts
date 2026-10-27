import axios from 'axios';
import type { InfectiousDisease, InfectiousDiseaseCreateInput, InfectiousDiseaseUpdateInput, InfectiousDiseaseListParams, InfectiousDiseaseListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const infectious_diseaseApi = {
  list: async (params: InfectiousDiseaseListParams = {}): Promise<InfectiousDiseaseListResponse> => {
    const { data } = await api.get('/infectious_disease', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<InfectiousDisease[]> => {
    const { data } = await api.get('/infectious_disease/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<InfectiousDisease> => {
    const { data } = await api.get(`/infectious_disease/${id}`);
    return data;
  },
  create: async (payload: InfectiousDiseaseCreateInput): Promise<InfectiousDisease> => {
    const { data } = await api.post('/infectious_disease', payload);
    return data;
  },
  update: async (id: number, payload: InfectiousDiseaseUpdateInput): Promise<InfectiousDisease> => {
    const { data } = await api.put(`/infectious_disease/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/infectious_disease/${id}`);
  },
  search: async (q: string): Promise<InfectiousDisease[]> => {
    const { data } = await api.get('/infectious_disease/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/infectious_disease/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/infectious_disease/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<InfectiousDisease> => {
    const { data } = await api.post(`/infectious_disease/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<InfectiousDisease> => {
    const { data } = await api.post(`/infectious_disease/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<InfectiousDisease> => {
    const { data } = await api.post(`/infectious_disease/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<InfectiousDisease> => {
    const { data } = await api.post(`/infectious_disease/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default infectious_diseaseApi;
