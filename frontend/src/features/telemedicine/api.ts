import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const telemedicineApi = {
  scheduleVisit: async (p: any) => { const { data } = await api.post('/telemedicine/visits', p); return data; },
  listVisits: async (params: any = {}) => { const { data } = await api.get('/telemedicine/visits', { params }); return data; },
  getVisit: async (id: number) => { const { data } = await api.get(`/telemedicine/visits/${id}`); return data; },
  startVisit: async (id: number) => { const { data } = await api.post(`/telemedicine/visits/${id}/start`); return data; },
  endVisit: async (id: number, quality?: string, notes?: string) => { const { data } = await api.post(`/telemedicine/visits/${id}/end`, null, { params: { quality, notes } }); return data; },
  cancelVisit: async (id: number, reason?: string) => { const { data } = await api.post(`/telemedicine/visits/${id}/cancel`, null, { params: { reason } }); return data; },
  enterWaitingRoom: async (p: any) => { const { data } = await api.post('/telemedicine/waiting-room', p); return data; },
  listWaitingRoom: async (admitted?: boolean) => { const { data } = await api.get('/telemedicine/waiting-room', { params: { admitted } }); return data; },
  admit: async (id: number) => { const { data } = await api.post(`/telemedicine/waiting-room/${id}/admit`); return data; },
  recordMetric: async (p: any) => { const { data } = await api.post('/telemedicine/metrics', p); return data; },
  listMetrics: async (visit_id: number) => { const { data } = await api.get(`/telemedicine/visits/${visit_id}/metrics`); return data; },
  summary: async () => { const { data } = await api.get('/telemedicine/summary'); return data; },
};
export default telemedicineApi;
