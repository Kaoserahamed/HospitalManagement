import axios from 'axios';
import type { PerformanceReview, PerformanceReviewCreateInput, PerformanceReviewUpdateInput, PerformanceReviewListParams, PerformanceReviewListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const performance_reviewApi = {
  list: async (params: PerformanceReviewListParams = {}): Promise<PerformanceReviewListResponse> => {
    const { data } = await api.get('/performance_review', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PerformanceReview[]> => {
    const { data } = await api.get('/performance_review/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PerformanceReview> => {
    const { data } = await api.get(`/performance_review/${id}`);
    return data;
  },
  create: async (payload: PerformanceReviewCreateInput): Promise<PerformanceReview> => {
    const { data } = await api.post('/performance_review', payload);
    return data;
  },
  update: async (id: number, payload: PerformanceReviewUpdateInput): Promise<PerformanceReview> => {
    const { data } = await api.put(`/performance_review/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/performance_review/${id}`);
  },
  search: async (q: string): Promise<PerformanceReview[]> => {
    const { data } = await api.get('/performance_review/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/performance_review/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/performance_review/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PerformanceReview> => {
    const { data } = await api.post(`/performance_review/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PerformanceReview> => {
    const { data } = await api.post(`/performance_review/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PerformanceReview> => {
    const { data } = await api.post(`/performance_review/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PerformanceReview> => {
    const { data } = await api.post(`/performance_review/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default performance_reviewApi;
