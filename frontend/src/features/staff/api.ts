import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const staffApi = {
  listProfiles: async (params: any = {}) => { const { data } = await api.get('/staff/profiles', { params }); return data; },
  getProfile: async (id: number) => { const { data } = await api.get(`/staff/profiles/${id}`); return data; },
  createProfile: async (p: any) => { const { data } = await api.post('/staff/profiles', p); return data; },
  updateProfile: async (id: number, p: any) => { const { data } = await api.put(`/staff/profiles/${id}`, p); return data; },
  listShifts: async (staff_id?: number, department_id?: number) => { const { data } = await api.get('/staff/shifts', { params: { staff_id, department_id } }); return data; },
  createShift: async (p: any) => { const { data } = await api.post('/staff/shifts', p); return data; },
  requestTimeOff: async (p: any) => { const { data } = await api.post('/staff/time-off', p); return data; },
  updateTimeOff: async (id: number, p: any) => { const { data } = await api.put(`/staff/time-off/${id}`, p); return data; },
  listTimeOff: async (staff_id?: number, status?: string) => { const { data } = await api.get('/staff/time-off', { params: { staff_id, status } }); return data; },
  listRoster: async (department_id?: number, date?: string) => { const { data } = await api.get('/staff/roster', { params: { department_id, date } }); return data; },
  coverageGaps: async (department_id: number, date: string) => { const { data } = await api.get('/staff/coverage-gaps', { params: { department_id, date } }); return data; },
};
export default staffApi;
