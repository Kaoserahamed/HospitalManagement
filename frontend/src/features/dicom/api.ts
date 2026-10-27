import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const dicomApi = {
  listStudies: async (patient_id?: number) => { const { data } = await api.get('/dicom/studies', { params: { patient_id } }); return data; },
  getStudy: async (id: number) => { const { data } = await api.get(`/dicom/studies/${id}`); return data; },
  getStudyByUid: async (uid: string) => { const { data } = await api.get(`/dicom/studies/uid/${uid}`); return data; },
  createStudy: async (p: any) => { const { data } = await api.post('/dicom/studies', p); return data; },
  listSeries: async (study_id: number) => { const { data } = await api.get(`/dicom/studies/${study_id}/series`); return data; },
  createSeries: async (p: any) => { const { data } = await api.post('/dicom/series', p); return data; },
  listInstances: async (series_id: number) => { const { data } = await api.get(`/dicom/series/${series_id}/instances`); return data; },
  createInstance: async (p: any) => { const { data } = await api.post('/dicom/instances', p); return data; },
  studySummary: async (study_id: number) => { const { data } = await api.get(`/dicom/studies/${study_id}/summary`); return data; },
  count: async () => { const { data } = await api.get('/dicom/count'); return data; },
};
export default dicomApi;
