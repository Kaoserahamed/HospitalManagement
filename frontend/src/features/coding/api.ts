import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const codingApi = {
  addCode: async (p: any) => { const { data } = await api.post('/coding/codes', p); return data; },
  lookup: async (system: string, code: string) => { const { data } = await api.get('/coding/codes/lookup', { params: { system, code } }); return data; },
  validate: async (system: string, code: string) => { const { data } = await api.get('/coding/codes/validate', { params: { system, code } }); return data; },
  search: async (p: any) => { const { data } = await api.post('/coding/codes/search', p); return data; },
  commonIcd10: async () => { const { data } = await api.get('/coding/codes/common/icd10'); return data; },
  commonCpt: async () => { const { data } = await api.get('/coding/codes/common/cpt'); return data; },
  addMapping: async (p: any) => { const { data } = await api.post('/coding/mappings', p); return data; },
  mapCode: async (source_system: string, source_code: string, target_system?: string) => { const { data } = await api.get('/coding/mappings', { params: { source_system, source_code, target_system } }); return data; },
  addEncounterCode: async (p: any) => { const { data } = await api.post('/coding/encounter-codes', p); return data; },
  listEncounterCodes: async (encounter_id: number) => { const { data } = await api.get(`/coding/encounter-codes/${encounter_id}`); return data; },
  removeEncounterCode: async (id: number) => { await api.delete(`/coding/encounter-codes/${id}`); },
};
export default codingApi;
