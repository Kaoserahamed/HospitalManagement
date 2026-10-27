import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const checkinApi = {
  checkIn: async (p: any) => { const { data } = await api.post('/checkin', p); return data; },
  list: async (params: any = {}) => { const { data } = await api.get('/checkin', { params }); return data; },
  get: async (id: number) => { const { data } = await api.get(`/checkin/${id}`); return data; },
  update: async (id: number, p: any) => { const { data } = await api.put(`/checkin/${id}`, p); return data; },
  call: async (id: number) => { const { data } = await api.post(`/checkin/${id}/call`); return data; },
  startService: async (id: number) => { const { data } = await api.post(`/checkin/${id}/start-service`); return data; },
  complete: async (id: number) => { const { data } = await api.post(`/checkin/${id}/complete`); return data; },
  noShow: async (id: number) => { const { data } = await api.post(`/checkin/${id}/no-show`); return data; },
  position: async (id: number) => { const { data } = await api.get(`/checkin/${id}/position`); return data; },
  nextPatient: async (department_id?: number) => { const { data } = await api.get('/checkin/queue/next', { params: { department_id } }); return data; },
  waitingCount: async (department_id?: number) => { const { data } = await api.get('/checkin/queue/count', { params: { department_id } }); return data; },
  queueStats: async (department_id?: number) => { const { data } = await api.get('/checkin/queue/stats', { params: { department_id } }); return data; },
  startKiosk: async (p: any) => { const { data } = await api.post('/checkin/kiosk/sessions', p); return data; },
  endKiosk: async (id: number) => { const { data } = await api.post(`/checkin/kiosk/sessions/${id}/end`); return data; },
};
export default checkinApi;
