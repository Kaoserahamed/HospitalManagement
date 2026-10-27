import axios from 'axios';
import type { QualityImprovement, QualityImprovementCreateInput, QualityImprovementUpdateInput, QualityImprovementListParams, QualityImprovementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const quality_improvementApi = {
  list: async (params: QualityImprovementListParams = {}): Promise<QualityImprovementListResponse> => {
    const { data } = await api.get('/quality_improvement', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<QualityImprovement[]> => {
    const { data } = await api.get('/quality_improvement/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<QualityImprovement> => {
    const { data } = await api.get(`/quality_improvement/${id}`);
    return data;
  },
  create: async (payload: QualityImprovementCreateInput): Promise<QualityImprovement> => {
    const { data } = await api.post('/quality_improvement', payload);
    return data;
  },
  update: async (id: number, payload: QualityImprovementUpdateInput): Promise<QualityImprovement> => {
    const { data } = await api.put(`/quality_improvement/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/quality_improvement/${id}`);
  },
  search: async (q: string): Promise<QualityImprovement[]> => {
    const { data } = await api.get('/quality_improvement/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/quality_improvement/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/quality_improvement/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<QualityImprovement> => {
    const { data } = await api.post(`/quality_improvement/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<QualityImprovement> => {
    const { data } = await api.post(`/quality_improvement/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<QualityImprovement> => {
    const { data } = await api.post(`/quality_improvement/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<QualityImprovement> => {
    const { data } = await api.post(`/quality_improvement/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default quality_improvementApi;
