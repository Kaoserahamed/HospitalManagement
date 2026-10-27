import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const analyticsApi = {
  createRegistry: async (p: any) => { const { data } = await api.post('/analytics/registries', p); return data; },
  listRegistries: async () => { const { data } = await api.get('/analytics/registries'); return data; },
  recordOutcome: async (p: any) => { const { data } = await api.post('/analytics/outcomes', p); return data; },
  listOutcomes: async (patient_id?: number, measure?: string) => { const { data } = await api.get('/analytics/outcomes', { params: { patient_id, measure } }); return data; },
  createMeasure: async (p: any) => { const { data } = await api.post('/analytics/quality-measures', p); return data; },
  listMeasures: async () => { const { data } = await api.get('/analytics/quality-measures'); return data; },
  updateMeasure: async (id: number, numerator?: number, denominator?: number) => { const { data } = await api.put(`/analytics/quality-measures/${id}`, null, { params: { numerator, denominator } }); return data; },
  createReport: async (p: any) => { const { data } = await api.post('/analytics/reports', p); return data; },
  listReports: async () => { const { data } = await api.get('/analytics/reports'); return data; },
  getReport: async (id: number) => { const { data } = await api.get(`/analytics/reports/${id}`); return data; },
  computeRisk: async (p: any) => { const { data } = await api.post('/analytics/readmission-risk', p); return data; },
  listRisks: async (patient_id?: number, risk_level?: string) => { const { data } = await api.get('/analytics/readmission-risk', { params: { patient_id, risk_level } }); return data; },
  dashboard: async () => { const { data } = await api.get('/analytics/dashboard'); return data; },
  standardReports: async () => { const { data } = await api.get('/analytics/standard-reports'); return data; },
};
export default analyticsApi;
