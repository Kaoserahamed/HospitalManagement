import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const schedulingApi = {
  requestSwap: async (p: any) => { const { data } = await api.post('/scheduling/swaps', p); return data; },
  listSwaps: async (status?: string) => { const { data } = await api.get('/scheduling/swaps', { params: { status } }); return data; },
  pendingSwaps: async () => { const { data } = await api.get('/scheduling/swaps/pending'); return data; },
  getSwap: async (id: number) => { const { data } = await api.get(`/scheduling/swaps/${id}`); return data; },
  approveSwap: async (id: number, reviewer_id: number) => { const { data } = await api.post(`/scheduling/swaps/${id}/approve`, null, { params: { reviewer_id } }); return data; },
  rejectSwap: async (id: number, reviewer_id: number) => { const { data } = await api.post(`/scheduling/swaps/${id}/reject`, null, { params: { reviewer_id } }); return data; },
  cancelSwap: async (id: number) => { const { data } = await api.post(`/scheduling/swaps/${id}/cancel`); return data; },
  createOnCall: async (p: any) => { const { data } = await api.post('/scheduling/oncall', p); return data; },
  listOnCall: async (department_id?: number, active_only = false) => { const { data } = await api.get('/scheduling/oncall', { params: { department_id, active_only } }); return data; },
  oncallForDepartment: async (department_id: number) => { const { data } = await api.get(`/scheduling/oncall/department/${department_id}`); return data; },
  createCoverageAlert: async (p: any) => { const { data } = await api.post('/scheduling/coverage-alerts', p); return data; },
  listCoverageAlerts: async (department_id?: number, acknowledged?: boolean) => { const { data } = await api.get('/scheduling/coverage-alerts', { params: { department_id, acknowledged } }); return data; },
  unacknowledgedAlerts: async () => { const { data } = await api.get('/scheduling/coverage-alerts/unacknowledged'); return data; },
  acknowledgeAlert: async (id: number) => { const { data } = await api.post(`/scheduling/coverage-alerts/${id}/acknowledge`); return data; },
  createTemplate: async (p: any) => { const { data } = await api.post('/scheduling/shift-templates', p); return data; },
  listTemplates: async (department_id?: number) => { const { data } = await api.get('/scheduling/shift-templates', { params: { department_id } }); return data; },
  applyTemplate: async (id: number, start_date: string, weeks = 1) => { const { data } = await api.post(`/scheduling/shift-templates/${id}/apply`, null, { params: { start_date, weeks } }); return data; },
  setAvailability: async (p: any) => { const { data } = await api.post('/scheduling/availability', p); return data; },
  getAvailability: async (staff_id: number) => { const { data } = await api.get(`/scheduling/availability/${staff_id}`); return data; },
  findAvailableStaff: async (department_id: number, day_of_week: number, start_time: string, end_time: string) => { const { data } = await api.get('/scheduling/available-staff', { params: { department_id, day_of_week, start_time, end_time } }); return data; },
  detectGaps: async (department_id: number, date: string, shift_type: string, required = 1) => { const { data } = await api.get('/scheduling/coverage-gaps', { params: { department_id, date, shift_type, required } }); return data; },
  generateSchedule: async (department_id: number, start_date: string, days = 7) => { const { data } = await api.get('/scheduling/generate-schedule', { params: { department_id, start_date, days } }); return data; },
  staffWorkload: async (staff_id: number) => { const { data } = await api.get(`/scheduling/workload/${staff_id}`); return data; },
  overtimeAlerts: async (threshold_hours = 40) => { const { data } = await api.get('/scheduling/overtime-alerts', { params: { threshold_hours } }); return data; },
};
export default schedulingApi;
