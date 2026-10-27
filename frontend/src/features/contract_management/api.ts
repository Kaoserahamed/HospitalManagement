import axios from 'axios';
import type { ContractManagement, ContractManagementCreateInput, ContractManagementUpdateInput, ContractManagementListParams, ContractManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const contract_managementApi = {
  list: async (params: ContractManagementListParams = {}): Promise<ContractManagementListResponse> => {
    const { data } = await api.get('/contract_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<ContractManagement[]> => {
    const { data } = await api.get('/contract_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<ContractManagement> => {
    const { data } = await api.get(`/contract_management/${id}`);
    return data;
  },
  create: async (payload: ContractManagementCreateInput): Promise<ContractManagement> => {
    const { data } = await api.post('/contract_management', payload);
    return data;
  },
  update: async (id: number, payload: ContractManagementUpdateInput): Promise<ContractManagement> => {
    const { data } = await api.put(`/contract_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/contract_management/${id}`);
  },
  search: async (q: string): Promise<ContractManagement[]> => {
    const { data } = await api.get('/contract_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/contract_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/contract_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<ContractManagement> => {
    const { data } = await api.post(`/contract_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<ContractManagement> => {
    const { data } = await api.post(`/contract_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<ContractManagement> => {
    const { data } = await api.post(`/contract_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<ContractManagement> => {
    const { data } = await api.post(`/contract_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default contract_managementApi;
