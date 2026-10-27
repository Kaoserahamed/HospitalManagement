import axios from 'axios';
import type { FallRisk, FallRiskCreateInput, FallRiskUpdateInput, FallRiskListParams, FallRiskListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const fall_riskApi = {
  list: async (params: FallRiskListParams = {}): Promise<FallRiskListResponse> => {
    const { data } = await api.get('/fall_risk', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<FallRisk[]> => {
    const { data } = await api.get('/fall_risk/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<FallRisk> => {
    const { data } = await api.get(`/fall_risk/${id}`);
    return data;
  },
  create: async (payload: FallRiskCreateInput): Promise<FallRisk> => {
    const { data } = await api.post('/fall_risk', payload);
    return data;
  },
  update: async (id: number, payload: FallRiskUpdateInput): Promise<FallRisk> => {
    const { data } = await api.put(`/fall_risk/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/fall_risk/${id}`);
  },
  search: async (q: string): Promise<FallRisk[]> => {
    const { data } = await api.get('/fall_risk/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/fall_risk/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/fall_risk/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<FallRisk> => {
    const { data } = await api.post(`/fall_risk/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<FallRisk> => {
    const { data } = await api.post(`/fall_risk/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<FallRisk> => {
    const { data } = await api.post(`/fall_risk/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<FallRisk> => {
    const { data } = await api.post(`/fall_risk/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default fall_riskApi;
