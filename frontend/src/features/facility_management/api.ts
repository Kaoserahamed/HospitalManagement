import axios from 'axios';
import type { FacilityManagement, FacilityManagementCreateInput, FacilityManagementUpdateInput, FacilityManagementListParams, FacilityManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const facility_managementApi = {
  list: async (params: FacilityManagementListParams = {}): Promise<FacilityManagementListResponse> => {
    const { data } = await api.get('/facility_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<FacilityManagement[]> => {
    const { data } = await api.get('/facility_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<FacilityManagement> => {
    const { data } = await api.get(`/facility_management/${id}`);
    return data;
  },
  create: async (payload: FacilityManagementCreateInput): Promise<FacilityManagement> => {
    const { data } = await api.post('/facility_management', payload);
    return data;
  },
  update: async (id: number, payload: FacilityManagementUpdateInput): Promise<FacilityManagement> => {
    const { data } = await api.put(`/facility_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/facility_management/${id}`);
  },
  search: async (q: string): Promise<FacilityManagement[]> => {
    const { data } = await api.get('/facility_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/facility_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/facility_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<FacilityManagement> => {
    const { data } = await api.post(`/facility_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<FacilityManagement> => {
    const { data } = await api.post(`/facility_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<FacilityManagement> => {
    const { data } = await api.post(`/facility_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<FacilityManagement> => {
    const { data } = await api.post(`/facility_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default facility_managementApi;
