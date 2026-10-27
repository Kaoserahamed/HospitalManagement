import axios from 'axios';
import type { VendorManagement, VendorManagementCreateInput, VendorManagementUpdateInput, VendorManagementListParams, VendorManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const vendor_managementApi = {
  list: async (params: VendorManagementListParams = {}): Promise<VendorManagementListResponse> => {
    const { data } = await api.get('/vendor_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<VendorManagement[]> => {
    const { data } = await api.get('/vendor_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<VendorManagement> => {
    const { data } = await api.get(`/vendor_management/${id}`);
    return data;
  },
  create: async (payload: VendorManagementCreateInput): Promise<VendorManagement> => {
    const { data } = await api.post('/vendor_management', payload);
    return data;
  },
  update: async (id: number, payload: VendorManagementUpdateInput): Promise<VendorManagement> => {
    const { data } = await api.put(`/vendor_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/vendor_management/${id}`);
  },
  search: async (q: string): Promise<VendorManagement[]> => {
    const { data } = await api.get('/vendor_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/vendor_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/vendor_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<VendorManagement> => {
    const { data } = await api.post(`/vendor_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<VendorManagement> => {
    const { data } = await api.post(`/vendor_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<VendorManagement> => {
    const { data } = await api.post(`/vendor_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<VendorManagement> => {
    const { data } = await api.post(`/vendor_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default vendor_managementApi;
