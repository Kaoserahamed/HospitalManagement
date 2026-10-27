import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const cdsApi = {
  listRules: async (rule_type?: string, active_only = false) => { const { data } = await api.get('/cds/rules', { params: { rule_type, active_only } }); return data; },
  createRule: async (p: any) => { const { data } = await api.post('/cds/rules', p); return data; },
  listAlerts: async (patient_id?: number, acknowledged?: boolean) => { const { data } = await api.get('/cds/alerts', { params: { patient_id, acknowledged } }); return data; },
  createAlert: async (p: any) => { const { data } = await api.post('/cds/alerts', p); return data; },
  acknowledgeAlert: async (id: number, acknowledged_by?: number) => { const { data } = await api.post(`/cds/alerts/${id}/acknowledge`, null, { params: { acknowledged_by } }); return data; },
  createDoseRange: async (p: any) => { const { data } = await api.post('/cds/dose-ranges', p); return data; },
  doseCheck: async (medication: string, dose: number, age?: number) => { const { data } = await api.get('/cds/dose-check', { params: { medication, dose, age } }); return data; },
  evaluate: async (p: any) => { const { data } = await api.post('/cds/evaluate', p); return data; },
  careGaps: async (patient_id: number, measures: string) => { const { data } = await api.get('/cds/care-gaps', { params: { patient_id, measures } }); return data; },
  diagnosisSuggestions: async (symptoms: string) => { const { data } = await api.get('/cds/diagnosis-suggestions', { params: { symptoms } }); return data; },
};
export default cdsApi;
