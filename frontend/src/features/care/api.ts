import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const careApi = {
  listTeams: async (patient_id?: number) => { const { data } = await api.get('/care/teams', { params: { patient_id } }); return data; },
  createTeam: async (p: any) => { const { data } = await api.post('/care/teams', p); return data; },
  addMember: async (team_id: number, user_id: number, role = 'consulting') => { const { data } = await api.post(`/care/teams/${team_id}/members`, null, { params: { user_id, role } }); return data; },
  listMembers: async (team_id: number) => { const { data } = await api.get(`/care/teams/${team_id}/members`); return data; },
  listTasks: async (params: any = {}) => { const { data } = await api.get('/care/tasks', { params }); return data; },
  createTask: async (p: any) => { const { data } = await api.post('/care/tasks', p); return data; },
  getTask: async (id: number) => { const { data } = await api.get(`/care/tasks/${id}`); return data; },
  updateTask: async (id: number, p: any) => { const { data } = await api.put(`/care/tasks/${id}`, p); return data; },
  completeTask: async (id: number) => { const { data } = await api.post(`/care/tasks/${id}/complete`); return data; },
  openTasks: async (patient_id: number) => { const { data } = await api.get(`/care/patients/${patient_id}/tasks`); return data; },
  overdueTasks: async () => { const { data } = await api.get('/care/tasks/overdue'); return data; },
  listHandoffs: async (patient_id?: number, to_user?: number) => { const { data } = await api.get('/care/handoffs', { params: { patient_id, to_user } }); return data; },
  createHandoff: async (p: any) => { const { data } = await api.post('/care/handoffs', p); return data; },
  acknowledgeHandoff: async (id: number) => { const { data } = await api.post(`/care/handoffs/${id}/acknowledge`); return data; },
  listDischargePlans: async (patient_id?: number) => { const { data } = await api.get('/care/discharge-plans', { params: { patient_id } }); return data; },
  createDischargePlan: async (p: any) => { const { data } = await api.post('/care/discharge-plans', p); return data; },
  getDischargePlan: async (id: number) => { const { data } = await api.get(`/care/discharge-plans/${id}`); return data; },
};
export default careApi;
