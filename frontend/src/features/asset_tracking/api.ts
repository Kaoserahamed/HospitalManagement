import axios from 'axios';
import type { AssetTracking, AssetTrackingCreateInput, AssetTrackingUpdateInput, AssetTrackingListParams, AssetTrackingListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const asset_trackingApi = {
  list: async (params: AssetTrackingListParams = {}): Promise<AssetTrackingListResponse> => {
    const { data } = await api.get('/asset_tracking', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<AssetTracking[]> => {
    const { data } = await api.get('/asset_tracking/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<AssetTracking> => {
    const { data } = await api.get(`/asset_tracking/${id}`);
    return data;
  },
  create: async (payload: AssetTrackingCreateInput): Promise<AssetTracking> => {
    const { data } = await api.post('/asset_tracking', payload);
    return data;
  },
  update: async (id: number, payload: AssetTrackingUpdateInput): Promise<AssetTracking> => {
    const { data } = await api.put(`/asset_tracking/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/asset_tracking/${id}`);
  },
  search: async (q: string): Promise<AssetTracking[]> => {
    const { data } = await api.get('/asset_tracking/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/asset_tracking/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/asset_tracking/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<AssetTracking> => {
    const { data } = await api.post(`/asset_tracking/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<AssetTracking> => {
    const { data } = await api.post(`/asset_tracking/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<AssetTracking> => {
    const { data } = await api.post(`/asset_tracking/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<AssetTracking> => {
    const { data } = await api.post(`/asset_tracking/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default asset_trackingApi;
