import axios from 'axios';
import type { SecurityIncident, SecurityIncidentCreateInput, SecurityIncidentUpdateInput, SecurityIncidentListParams, SecurityIncidentListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const security_incidentApi = {
  list: async (params: SecurityIncidentListParams = {}): Promise<SecurityIncidentListResponse> => {
    const { data } = await api.get('/security_incident', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<SecurityIncident[]> => {
    const { data } = await api.get('/security_incident/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<SecurityIncident> => {
    const { data } = await api.get(`/security_incident/${id}`);
    return data;
  },
  create: async (payload: SecurityIncidentCreateInput): Promise<SecurityIncident> => {
    const { data } = await api.post('/security_incident', payload);
    return data;
  },
  update: async (id: number, payload: SecurityIncidentUpdateInput): Promise<SecurityIncident> => {
    const { data } = await api.put(`/security_incident/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/security_incident/${id}`);
  },
  search: async (q: string): Promise<SecurityIncident[]> => {
    const { data } = await api.get('/security_incident/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/security_incident/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/security_incident/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<SecurityIncident> => {
    const { data } = await api.post(`/security_incident/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<SecurityIncident> => {
    const { data } = await api.post(`/security_incident/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<SecurityIncident> => {
    const { data } = await api.post(`/security_incident/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<SecurityIncident> => {
    const { data } = await api.post(`/security_incident/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default security_incidentApi;
