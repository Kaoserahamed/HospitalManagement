import axios from 'axios';
import type { RemoteMonitoring, RemoteMonitoringCreateInput, RemoteMonitoringUpdateInput, RemoteMonitoringListParams, RemoteMonitoringListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const remote_monitoringApi = {
  list: async (params: RemoteMonitoringListParams = {}): Promise<RemoteMonitoringListResponse> => {
    const { data } = await api.get('/remote_monitoring', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<RemoteMonitoring[]> => {
    const { data } = await api.get('/remote_monitoring/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<RemoteMonitoring> => {
    const { data } = await api.get(`/remote_monitoring/${id}`);
    return data;
  },
  create: async (payload: RemoteMonitoringCreateInput): Promise<RemoteMonitoring> => {
    const { data } = await api.post('/remote_monitoring', payload);
    return data;
  },
  update: async (id: number, payload: RemoteMonitoringUpdateInput): Promise<RemoteMonitoring> => {
    const { data } = await api.put(`/remote_monitoring/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/remote_monitoring/${id}`);
  },
  search: async (q: string): Promise<RemoteMonitoring[]> => {
    const { data } = await api.get('/remote_monitoring/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/remote_monitoring/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/remote_monitoring/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<RemoteMonitoring> => {
    const { data } = await api.post(`/remote_monitoring/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<RemoteMonitoring> => {
    const { data } = await api.post(`/remote_monitoring/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<RemoteMonitoring> => {
    const { data } = await api.post(`/remote_monitoring/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<RemoteMonitoring> => {
    const { data } = await api.post(`/remote_monitoring/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default remote_monitoringApi;
