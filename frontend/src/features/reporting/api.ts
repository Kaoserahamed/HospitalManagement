import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const reportingApi = {
  listDefinitions: async (active_only = false) => { const { data } = await api.get('/reporting/definitions', { params: { active_only } }); return data; },
  getDefinition: async (id: number) => { const { data } = await api.get(`/reporting/definitions/${id}`); return data; },
  createDefinition: async (p: any) => { const { data } = await api.post('/reporting/definitions', p); return data; },
  updateDefinition: async (id: number, p: any) => { const { data } = await api.put(`/reporting/definitions/${id}`, p); return data; },
  deleteDefinition: async (id: number) => { await api.delete(`/reporting/definitions/${id}`); },
  run: async (p: any) => { const { data } = await api.post('/reporting/run', p); return data; },
  listExecutions: async (definition_id?: number) => { const { data } = await api.get('/reporting/executions', { params: { definition_id } }); return data; },
  getExecution: async (id: number) => { const { data } = await api.get(`/reporting/executions/${id}`); return data; },
  subscribe: async (p: any) => { const { data } = await api.post('/reporting/subscriptions', p); return data; },
  listSubscriptions: async (definition_id?: number) => { const { data } = await api.get('/reporting/subscriptions', { params: { definition_id } }); return data; },
  scheduled: async () => { const { data } = await api.get('/reporting/scheduled'); return data; },
  standardDefinitions: async () => { const { data } = await api.get('/reporting/standard-definitions'); return data; },
};
export default reportingApi;
