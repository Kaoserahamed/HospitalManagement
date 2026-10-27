import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const populationApi = {
  listRegistries: async () => { const { data } = await api.get('/population/registries'); return data; },
  getRegistry: async (id: number) => { const { data } = await api.get(`/population/registries/${id}`); return data; },
  createRegistry: async (p: any) => { const { data } = await api.post('/population/registries', p); return data; },
  enrollMember: async (registry_id: number, patient_id: number) => { const { data } = await api.post(`/population/registries/${registry_id}/members`, null, { params: { patient_id } }); return data; },
  listMembers: async (registry_id: number) => { const { data } = await api.get(`/population/registries/${registry_id}/members`); return data; },
  listMeasures: async (registry_id?: number) => { const { data } = await api.get('/population/measures', { params: { registry_id } }); return data; },
  createMeasure: async (p: any) => { const { data } = await api.post('/population/measures', p); return data; },
  recordOutcome: async (p: any) => { const { data } = await api.post('/population/outcomes', p); return data; },
  listOutcomes: async (patient_id?: number, registry_id?: number) => { const { data } = await api.get('/population/outcomes', { params: { patient_id, registry_id } }); return data; },
  patientRegistries: async (patient_id: number) => { const { data } = await api.get(`/population/patients/${patient_id}/registries`); return data; },
  registrySummary: async (registry_id: number) => { const { data } = await api.get(`/population/registries/${registry_id}/summary`); return data; },
  highRisk: async (registry_id?: number) => { const { data } = await api.get('/population/high-risk', { params: { registry_id } }); return data; },
};
export default populationApi;
