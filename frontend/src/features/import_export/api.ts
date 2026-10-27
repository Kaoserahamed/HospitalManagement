import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const importExportApi = {
  listImports: async (params: any = {}) => { const { data } = await api.get('/import-export/imports', { params }); return data; },
  getImport: async (id: number) => { const { data } = await api.get(`/import-export/imports/${id}`); return data; },
  createImport: async (p: any) => { const { data } = await api.post('/import-export/imports', p); return data; },
  processImport: async (id: number) => { const { data } = await api.post(`/import-export/imports/${id}/process`); return data; },
  cancelImport: async (id: number) => { const { data } = await api.post(`/import-export/imports/${id}/cancel`); return data; },
  importData: async (p: any) => { const { data } = await api.post('/import-export/import', p); return data; },
  listExports: async (params: any = {}) => { const { data } = await api.get('/import-export/exports', { params }); return data; },
  getExport: async (id: number) => { const { data } = await api.get(`/import-export/exports/${id}`); return data; },
  createExport: async (p: any) => { const { data } = await api.post('/import-export/exports', p); return data; },
  processExport: async (id: number) => { const { data } = await api.post(`/import-export/exports/${id}/process`); return data; },
  exportData: async (p: any) => { const { data } = await api.post('/import-export/export', p); return data; },
  validate: async (entity_type: string, rows: any[]) => { const { data } = await api.post('/import-export/validate', rows, { params: { entity_type } }); return data; },
  transform: async (entity_type: string, row: any, mapping?: any) => { const { data } = await api.post('/import-export/transform', row, { params: { entity_type, mapping } }); return data; },
  supportedEntities: async () => { const { data } = await api.get('/import-export/supported-entities'); return data; },
  supportedFormats: async () => { const { data } = await api.get('/import-export/supported-formats'); return data; },
  generateTemplate: async (entity_type: string) => { const { data } = await api.get(`/import-export/template/${entity_type}`); return data; },
};
export default importExportApi;
