import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const escalationApi = {
  listPolicies: async () => { const { data } = await api.get('/escalation/policies'); return data; },
  createPolicy: async (p: any) => { const { data } = await api.post('/escalation/policies', p); return data; },
  list: async (params: any = {}) => { const { data } = await api.get('/escalation', { params }); return data; },
  get: async (id: number) => { const { data } = await api.get(`/escalation/${id}`); return data; },
  create: async (p: any) => { const { data } = await api.post('/escalation', p); return data; },
  update: async (id: number, p: any) => { const { data } = await api.put(`/escalation/${id}`, p); return data; },
  resolve: async (id: number, notes?: string) => { const { data } = await api.post(`/escalation/${id}/resolve`, null, { params: { notes } }); return data; },
  escalate: async (id: number) => { const { data } = await api.post(`/escalation/${id}/escalate`); return data; },
  acknowledge: async (id: number, acknowledged_by?: number) => { const { data } = await api.post(`/escalation/${id}/acknowledge`, null, { params: { acknowledged_by } }); return data; },
  openEscalations: async (patient_id?: number) => { const { data } = await api.get('/escalation/open', { params: { patient_id } }); return data; },
  criticalEscalations: async () => { const { data } = await api.get('/escalation/critical'); return data; },
  escalateFromMonitoring: async (patient_id: number, vital_type: string, value: number, severity: string) => { const { data } = await api.post('/escalation/from-monitoring', null, { params: { patient_id, vital_type, value, severity } }); return data; },
  escalateFromCds: async (patient_id: number, alert_message: string) => { const { data } = await api.post('/escalation/from-cds', null, { params: { patient_id, alert_message } }); return data; },
  countOpen: async () => { const { data } = await api.get('/escalation/count'); return data; },
};
export default escalationApi;
