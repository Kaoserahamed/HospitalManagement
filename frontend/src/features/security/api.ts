import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const securityApi = {
  setupMfa: async (user_id: number, method = 'totp') => { const { data } = await api.post('/security/mfa/setup', null, { params: { user_id, method } }); return data; },
  verifyMfa: async (p: any) => { const { data } = await api.post('/security/mfa/verify', p); return data; },
  disableMfa: async (user_id: number) => { const { data } = await api.post('/security/mfa/disable', null, { params: { user_id } }); return data; },
  mfaStatus: async (user_id: number) => { const { data } = await api.get('/security/mfa/status', { params: { user_id } }); return data; },
  linkSso: async (p: any) => { const { data } = await api.post('/security/sso/link', p); return data; },
  getSsoLinks: async (user_id: number) => { const { data } = await api.get('/security/sso/links', { params: { user_id } }); return data; },
  unlinkSso: async (user_id: number, provider: string) => { const { data } = await api.delete('/security/sso/link', { params: { user_id, provider } }); return data; },
  recordEvent: async (p: any) => { const { data } = await api.post('/security/events', p); return data; },
  listEvents: async (params: any = {}) => { const { data } = await api.get('/security/events', { params }); return data; },
  createKey: async (p: any) => { const { data } = await api.post('/security/keys', p); return data; },
  getActiveKey: async (purpose: string) => { const { data } = await api.get('/security/keys/active', { params: { purpose } }); return data; },
  rotateKey: async (key_id: string) => { const { data } = await api.post(`/security/keys/${key_id}/rotate`); return data; },
  checkPermission: async (p: any) => { const { data } = await api.post('/security/permissions/check', p); return data; },
  hashPassword: async (password: string) => { const { data } = await api.post('/security/hash-password', null, { params: { password } }); return data; },
  verifyPassword: async (password: string, hashed: string) => { const { data } = await api.post('/security/verify-password', null, { params: { password, hashed } }); return data; },
  generateToken: async (user_id: number, expiry_minutes = 60) => { const { data } = await api.post('/security/tokens/generate', null, { params: { user_id, expiry_minutes } }); return data; },
  validateToken: async (token: string) => { const { data } = await api.post('/security/tokens/validate', null, { params: { token } }); return data; },
  encrypt: async (value: string, key_id: string) => { const { data } = await api.post('/security/encrypt', null, { params: { value, key_id } }); return data; },
  decrypt: async (value: string, key_id: string) => { const { data } = await api.post('/security/decrypt', null, { params: { value, key_id } }); return data; },
  summary: async () => { const { data } = await api.get('/security/summary'); return data; },
};
export default securityApi;
