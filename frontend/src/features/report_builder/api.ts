import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const reportBuilderApi = {
  listTemplates: async (active_only = false) => { const { data } = await api.get('/report-builder/templates', { params: { active_only } }); return data; },
  getTemplate: async (id: number) => { const { data } = await api.get(`/report-builder/templates/${id}`); return data; },
  createTemplate: async (p: any) => { const { data } = await api.post('/report-builder/templates', p); return data; },
  updateTemplate: async (id: number, p: any) => { const { data } = await api.put(`/report-builder/templates/${id}`, p); return data; },
  deleteTemplate: async (id: number) => { await api.delete(`/report-builder/templates/${id}`); },
  listSchedules: async (template_id?: number, active_only = false) => { const { data } = await api.get('/report-builder/schedules', { params: { template_id, active_only } }); return data; },
  createSchedule: async (p: any) => { const { data } = await api.post('/report-builder/schedules', p); return data; },
  dueSchedules: async () => { const { data } = await api.get('/report-builder/schedules/due'); return data; },
  run: async (p: any) => { const { data } = await api.post('/report-builder/run', p); return data; },
  export: async (p: any) => { const { data } = await api.post('/report-builder/exports', p); return data; },
  listExports: async (template_id?: number) => { const { data } = await api.get('/report-builder/exports', { params: { template_id } }); return data; },
  getExport: async (id: number) => { const { data } = await api.get(`/report-builder/exports/${id}`); return data; },
  listDashboards: async () => { const { data } = await api.get('/report-builder/dashboards'); return data; },
  createDashboard: async (p: any) => { const { data } = await api.post('/report-builder/dashboards', p); return data; },
  getDashboard: async (id: number) => { const { data } = await api.get(`/report-builder/dashboards/${id}`); return data; },
  defaultDashboard: async () => { const { data } = await api.get('/report-builder/dashboards/default'); return data; },
  standardTemplates: async () => { const { data } = await api.get('/report-builder/standard-templates'); return data; },
};
export default reportBuilderApi;
