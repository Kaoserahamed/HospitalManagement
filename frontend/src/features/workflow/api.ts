import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const workflowApi = {
  listDefinitions: async (active_only = false) => { const { data } = await api.get('/workflow/definitions', { params: { active_only } }); return data; },
  getDefinition: async (id: number) => { const { data } = await api.get(`/workflow/definitions/${id}`); return data; },
  createDefinition: async (p: any) => { const { data } = await api.post('/workflow/definitions', p); return data; },
  listInstances: async (params: any = {}) => { const { data } = await api.get('/workflow/instances', { params }); return data; },
  getInstance: async (id: number) => { const { data } = await api.get(`/workflow/instances/${id}`); return data; },
  startInstance: async (p: any) => { const { data } = await api.post('/workflow/instances', p); return data; },
  advance: async (instance_id: number, action = 'next', performed_by?: number, notes?: string) => { const { data } = await api.post(`/workflow/instances/${instance_id}/advance`, null, { params: { action, performed_by, notes } }); return data; },
  skipStep: async (instance_id: number, step_index: number, performed_by?: number) => { const { data } = await api.post(`/workflow/instances/${instance_id}/skip`, null, { params: { step_index, performed_by } }); return data; },
  failStep: async (instance_id: number, step_index: number, notes?: string) => { const { data } = await api.post(`/workflow/instances/${instance_id}/fail`, null, { params: { step_index, notes } }); return data; },
  pause: async (instance_id: number) => { const { data } = await api.post(`/workflow/instances/${instance_id}/pause`); return data; },
  resume: async (instance_id: number) => { const { data } = await api.post(`/workflow/instances/${instance_id}/resume`); return data; },
  cancel: async (instance_id: number) => { const { data } = await api.post(`/workflow/instances/${instance_id}/cancel`); return data; },
  progress: async (instance_id: number) => { const { data } = await api.get(`/workflow/instances/${instance_id}/progress`); return data; },
  history: async (instance_id: number) => { const { data } = await api.get(`/workflow/instances/${instance_id}/history`); return data; },
};
export default workflowApi;
