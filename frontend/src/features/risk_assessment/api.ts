import axios from 'axios';
import type { RiskAssessment, RiskAssessmentCreateInput, RiskAssessmentUpdateInput, RiskAssessmentListParams, RiskAssessmentListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const risk_assessmentApi = {
  list: async (params: RiskAssessmentListParams = {}): Promise<RiskAssessmentListResponse> => {
    const { data } = await api.get('/risk_assessment', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<RiskAssessment[]> => {
    const { data } = await api.get('/risk_assessment/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<RiskAssessment> => {
    const { data } = await api.get(`/risk_assessment/${id}`);
    return data;
  },
  create: async (payload: RiskAssessmentCreateInput): Promise<RiskAssessment> => {
    const { data } = await api.post('/risk_assessment', payload);
    return data;
  },
  update: async (id: number, payload: RiskAssessmentUpdateInput): Promise<RiskAssessment> => {
    const { data } = await api.put(`/risk_assessment/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/risk_assessment/${id}`);
  },
  search: async (q: string): Promise<RiskAssessment[]> => {
    const { data } = await api.get('/risk_assessment/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/risk_assessment/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/risk_assessment/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<RiskAssessment> => {
    const { data } = await api.post(`/risk_assessment/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<RiskAssessment> => {
    const { data } = await api.post(`/risk_assessment/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<RiskAssessment> => {
    const { data } = await api.post(`/risk_assessment/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<RiskAssessment> => {
    const { data } = await api.post(`/risk_assessment/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default risk_assessmentApi;
