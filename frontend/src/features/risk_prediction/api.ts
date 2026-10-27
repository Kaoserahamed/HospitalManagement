import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const riskPredictionApi = {
  listModels: async () => { const { data } = await api.get('/risk/models'); return data; },
  getModel: async (id: number) => { const { data } = await api.get(`/risk/models/${id}`); return data; },
  activeModel: async () => { const { data } = await api.get('/risk/models/active'); return data; },
  createModel: async (p: any) => { const { data } = await api.post('/risk/models', p); return data; },
  listFactors: async () => { const { data } = await api.get('/risk/factors'); return data; },
  createFactor: async (p: any) => { const { data } = await api.post('/risk/factors', p); return data; },
  featureImportance: async () => { const { data } = await api.get('/risk/factors/importance'); return data; },
  evaluate: async (p: any) => { const { data } = await api.post('/risk/evaluate', p); return data; },
  predictReadmission: async (patient_id: number, encounter_id?: number) => { const { data } = await api.post('/risk/predict/readmission', null, { params: { patient_id, encounter_id } }); return data; },
  listPredictions: async (patient_id?: number) => { const { data } = await api.get('/risk/predictions', { params: { patient_id } }); return data; },
  getPrediction: async (id: number) => { const { data } = await api.get(`/risk/predictions/${id}`); return data; },
  highRiskPatients: async (threshold = 0.7) => { const { data } = await api.get('/risk/high-risk', { params: { threshold } }); return data; },
  riskTrend: async (patient_id: number) => { const { data } = await api.get(`/risk/patients/${patient_id}/trend`); return data; },
};
export default riskPredictionApi;
