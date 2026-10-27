import axios from 'axios';
import type { ClinicalAlerts, ClinicalAlertsCreateInput, ClinicalAlertsUpdateInput, ClinicalAlertsListParams, ClinicalAlertsListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const clinical_alertsApi = {
  list: async (params: ClinicalAlertsListParams = {}): Promise<ClinicalAlertsListResponse> => {
    const { data } = await api.get('/clinical_alerts', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<ClinicalAlerts[]> => {
    const { data } = await api.get('/clinical_alerts/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<ClinicalAlerts> => {
    const { data } = await api.get(`/clinical_alerts/${id}`);
    return data;
  },
  create: async (payload: ClinicalAlertsCreateInput): Promise<ClinicalAlerts> => {
    const { data } = await api.post('/clinical_alerts', payload);
    return data;
  },
  update: async (id: number, payload: ClinicalAlertsUpdateInput): Promise<ClinicalAlerts> => {
    const { data } = await api.put(`/clinical_alerts/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/clinical_alerts/${id}`);
  },
  search: async (q: string): Promise<ClinicalAlerts[]> => {
    const { data } = await api.get('/clinical_alerts/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/clinical_alerts/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/clinical_alerts/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<ClinicalAlerts> => {
    const { data } = await api.post(`/clinical_alerts/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<ClinicalAlerts> => {
    const { data } = await api.post(`/clinical_alerts/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<ClinicalAlerts> => {
    const { data } = await api.post(`/clinical_alerts/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<ClinicalAlerts> => {
    const { data } = await api.post(`/clinical_alerts/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default clinical_alertsApi;
