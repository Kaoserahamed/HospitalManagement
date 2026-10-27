import axios from 'axios';
import type { StrokeProtocol, StrokeProtocolCreateInput, StrokeProtocolUpdateInput, StrokeProtocolListParams, StrokeProtocolListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const stroke_protocolApi = {
  list: async (params: StrokeProtocolListParams = {}): Promise<StrokeProtocolListResponse> => {
    const { data } = await api.get('/stroke_protocol', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<StrokeProtocol[]> => {
    const { data } = await api.get('/stroke_protocol/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<StrokeProtocol> => {
    const { data } = await api.get(`/stroke_protocol/${id}`);
    return data;
  },
  create: async (payload: StrokeProtocolCreateInput): Promise<StrokeProtocol> => {
    const { data } = await api.post('/stroke_protocol', payload);
    return data;
  },
  update: async (id: number, payload: StrokeProtocolUpdateInput): Promise<StrokeProtocol> => {
    const { data } = await api.put(`/stroke_protocol/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/stroke_protocol/${id}`);
  },
  search: async (q: string): Promise<StrokeProtocol[]> => {
    const { data } = await api.get('/stroke_protocol/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/stroke_protocol/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/stroke_protocol/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<StrokeProtocol> => {
    const { data } = await api.post(`/stroke_protocol/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<StrokeProtocol> => {
    const { data } = await api.post(`/stroke_protocol/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<StrokeProtocol> => {
    const { data } = await api.post(`/stroke_protocol/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<StrokeProtocol> => {
    const { data } = await api.post(`/stroke_protocol/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default stroke_protocolApi;
