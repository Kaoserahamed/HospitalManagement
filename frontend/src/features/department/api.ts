import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const departmentApi = {
  list: async (params: any = {}) => { const { data } = await api.get('/departments', { params }); return data; },
  get: async (id: number) => { const { data } = await api.get(`/departments/${id}`); return data; },
  create: async (p: any) => { const { data } = await api.post('/departments', p); return data; },
  update: async (id: number, p: any) => { const { data } = await api.put(`/departments/${id}`, p); return data; },
  remove: async (id: number) => { await api.delete(`/departments/${id}`); },
  addRoom: async (department_id: number, p: any) => { const { data } = await api.post(`/departments/${department_id}/rooms`, p); return data; },
  listRooms: async (department_id: number) => { const { data } = await api.get(`/departments/${department_id}/rooms`); return data; },
  addEquipment: async (department_id: number, p: any) => { const { data } = await api.post(`/departments/${department_id}/equipment`, p); return data; },
  listEquipment: async (department_id: number) => { const { data } = await api.get(`/departments/${department_id}/equipment`); return data; },
};
export default departmentApi;
