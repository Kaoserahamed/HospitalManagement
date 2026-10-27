import axios from 'axios';
import type { SupplyChain, SupplyChainCreateInput, SupplyChainUpdateInput, SupplyChainListParams, SupplyChainListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const supply_chainApi = {
  list: async (params: SupplyChainListParams = {}): Promise<SupplyChainListResponse> => {
    const { data } = await api.get('/supply_chain', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<SupplyChain[]> => {
    const { data } = await api.get('/supply_chain/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<SupplyChain> => {
    const { data } = await api.get(`/supply_chain/${id}`);
    return data;
  },
  create: async (payload: SupplyChainCreateInput): Promise<SupplyChain> => {
    const { data } = await api.post('/supply_chain', payload);
    return data;
  },
  update: async (id: number, payload: SupplyChainUpdateInput): Promise<SupplyChain> => {
    const { data } = await api.put(`/supply_chain/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/supply_chain/${id}`);
  },
  search: async (q: string): Promise<SupplyChain[]> => {
    const { data } = await api.get('/supply_chain/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/supply_chain/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/supply_chain/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<SupplyChain> => {
    const { data } = await api.post(`/supply_chain/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<SupplyChain> => {
    const { data } = await api.post(`/supply_chain/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<SupplyChain> => {
    const { data } = await api.post(`/supply_chain/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<SupplyChain> => {
    const { data } = await api.post(`/supply_chain/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default supply_chainApi;
