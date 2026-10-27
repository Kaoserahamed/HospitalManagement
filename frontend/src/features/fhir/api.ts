import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const fhirApi = {
  createResource: async (p: any) => { const { data } = await api.post('/fhir/resources', p); return data; },
  getResource: async (type: string, id: string) => { const { data } = await api.get(`/fhir/resources/${type}/${id}`); return data; },
  updateResource: async (type: string, id: string, p: any) => { const { data } = await api.put(`/fhir/resources/${type}/${id}`, p); return data; },
  deleteResource: async (type: string, id: string) => { await api.delete(`/fhir/resources/${type}/${id}`); },
  search: async (p: any) => { const { data } = await api.post('/fhir/search', p); return data; },
  createBundle: async (p: any) => { const { data } = await api.post('/fhir/bundles', p); return data; },
  getBundle: async (id: number) => { const { data } = await api.get(`/fhir/bundles/${id}`); return data; },
  createSubscription: async (p: any) => { const { data } = await api.post('/fhir/subscriptions', p); return data; },
  listSubscriptions: async (resource_type?: string) => { const { data } = await api.get('/fhir/subscriptions', { params: { resource_type } }); return data; },
  count: async () => { const { data } = await api.get('/fhir/count'); return data; },
};
export default fhirApi;
