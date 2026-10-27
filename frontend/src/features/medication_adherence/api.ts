import axios from 'axios';
import type { MedicationAdherence, MedicationAdherenceCreateInput, MedicationAdherenceUpdateInput, MedicationAdherenceListParams, MedicationAdherenceListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const medication_adherenceApi = {
  list: async (params: MedicationAdherenceListParams = {}): Promise<MedicationAdherenceListResponse> => {
    const { data } = await api.get('/medication_adherence', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<MedicationAdherence[]> => {
    const { data } = await api.get('/medication_adherence/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<MedicationAdherence> => {
    const { data } = await api.get(`/medication_adherence/${id}`);
    return data;
  },
  create: async (payload: MedicationAdherenceCreateInput): Promise<MedicationAdherence> => {
    const { data } = await api.post('/medication_adherence', payload);
    return data;
  },
  update: async (id: number, payload: MedicationAdherenceUpdateInput): Promise<MedicationAdherence> => {
    const { data } = await api.put(`/medication_adherence/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/medication_adherence/${id}`);
  },
  search: async (q: string): Promise<MedicationAdherence[]> => {
    const { data } = await api.get('/medication_adherence/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/medication_adherence/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/medication_adherence/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<MedicationAdherence> => {
    const { data } = await api.post(`/medication_adherence/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<MedicationAdherence> => {
    const { data } = await api.post(`/medication_adherence/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<MedicationAdherence> => {
    const { data } = await api.post(`/medication_adherence/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<MedicationAdherence> => {
    const { data } = await api.post(`/medication_adherence/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default medication_adherenceApi;
