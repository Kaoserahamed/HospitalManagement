import axios from 'axios';
import type { QualityMeasure, QualityMeasureCreateInput, QualityMeasureUpdateInput, QualityMeasureListParams, QualityMeasureListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const quality_measureApi = {
  list: async (params: QualityMeasureListParams = {}): Promise<QualityMeasureListResponse> => {
    const { data } = await api.get('/quality_measure', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<QualityMeasure[]> => {
    const { data } = await api.get('/quality_measure/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<QualityMeasure> => {
    const { data } = await api.get(`/quality_measure/${id}`);
    return data;
  },
  create: async (payload: QualityMeasureCreateInput): Promise<QualityMeasure> => {
    const { data } = await api.post('/quality_measure', payload);
    return data;
  },
  update: async (id: number, payload: QualityMeasureUpdateInput): Promise<QualityMeasure> => {
    const { data } = await api.put(`/quality_measure/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/quality_measure/${id}`);
  },
  search: async (q: string): Promise<QualityMeasure[]> => {
    const { data } = await api.get('/quality_measure/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/quality_measure/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/quality_measure/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<QualityMeasure> => {
    const { data } = await api.post(`/quality_measure/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<QualityMeasure> => {
    const { data } = await api.post(`/quality_measure/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<QualityMeasure> => {
    const { data } = await api.post(`/quality_measure/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<QualityMeasure> => {
    const { data } = await api.post(`/quality_measure/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default quality_measureApi;
