import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const rulesEngineApi = {
  listRules: async (rule_type?: string, status?: string) => { const { data } = await api.get('/rules', { params: { rule_type, status } }); return data; },
  getRule: async (id: number) => { const { data } = await api.get(`/rules/${id}`); return data; },
  createRule: async (p: any) => { const { data } = await api.post('/rules', p); return data; },
  updateRule: async (id: number, p: any) => { const { data } = await api.put(`/rules/${id}`, p); return data; },
  activateRule: async (id: number) => { const { data } = await api.post(`/rules/${id}/activate`); return data; },
  disableRule: async (id: number) => { const { data } = await api.post(`/rules/${id}/disable`); return data; },
  evaluate: async (p: any) => { const { data } = await api.post('/rules/evaluate', p); return data; },
  listSets: async () => { const { data } = await api.get('/rules/sets'); return data; },
  createSet: async (p: any) => { const { data } = await api.post('/rules/sets', p); return data; },
  executeSet: async (id: number, input_data: any) => { const { data } = await api.post(`/rules/sets/${id}/execute`, input_data); return data; },
  listExecutions: async (rule_id?: number) => { const { data } = await api.get('/rules/executions', { params: { rule_id } }); return data; },
  activeRules: async () => { const { data } = await api.get('/rules/active'); return data; },
  rulesByType: async (rule_type: string) => { const { data } = await api.get(`/rules/by-type/${rule_type}`); return data; },
};
export default rulesEngineApi;
