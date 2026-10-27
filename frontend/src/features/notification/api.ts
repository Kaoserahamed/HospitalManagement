import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const notificationApi = {
  send: async (p: any) => { const { data } = await api.post('/notifications', p); return data; },
  sendBulk: async (p: any) => { const { data } = await api.post('/notifications/bulk', p); return data; },
  list: async (params: any = {}) => { const { data } = await api.get('/notifications', { params }); return data; },
  unreadCount: async (recipient_id: number) => { const { data } = await api.get('/notifications/unread-count', { params: { recipient_id } }); return data; },
  markRead: async (id: number) => { const { data } = await api.post(`/notifications/${id}/read`); return data; },
  markAllRead: async (recipient_id: number) => { const { data } = await api.post('/notifications/read-all', null, { params: { recipient_id } }); return data; },
  listTemplates: async () => { const { data } = await api.get('/notifications/templates'); return data; },
  createTemplate: async (p: any) => { const { data } = await api.post('/notifications/templates', p); return data; },
  getTemplate: async (name: string) => { const { data } = await api.get(`/notifications/templates/${name}`); return data; },
  renderTemplate: async (name: string, context: any) => { const { data } = await api.post(`/notifications/templates/${name}/render`, context); return data; },
};
export default notificationApi;
