import axios from 'axios';
import type { MedicationReconciliation, MedicationReconciliationCreateInput, MedicationReconciliationUpdateInput, MedicationReconciliationListParams, MedicationReconciliationListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const medication_reconciliationApi = {
  list: async (params: MedicationReconciliationListParams = {}): Promise<MedicationReconciliationListResponse> => {
    const { data } = await api.get('/medication_reconciliation', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<MedicationReconciliation[]> => {
    const { data } = await api.get('/medication_reconciliation/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<MedicationReconciliation> => {
    const { data } = await api.get(`/medication_reconciliation/${id}`);
    return data;
  },
  create: async (payload: MedicationReconciliationCreateInput): Promise<MedicationReconciliation> => {
    const { data } = await api.post('/medication_reconciliation', payload);
    return data;
  },
  update: async (id: number, payload: MedicationReconciliationUpdateInput): Promise<MedicationReconciliation> => {
    const { data } = await api.put(`/medication_reconciliation/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/medication_reconciliation/${id}`);
  },
  search: async (q: string): Promise<MedicationReconciliation[]> => {
    const { data } = await api.get('/medication_reconciliation/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/medication_reconciliation/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/medication_reconciliation/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<MedicationReconciliation> => {
    const { data } = await api.post(`/medication_reconciliation/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<MedicationReconciliation> => {
    const { data } = await api.post(`/medication_reconciliation/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<MedicationReconciliation> => {
    const { data } = await api.post(`/medication_reconciliation/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<MedicationReconciliation> => {
    const { data } = await api.post(`/medication_reconciliation/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default medication_reconciliationApi;
