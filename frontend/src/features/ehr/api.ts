import axios from 'axios';
import type { Encounter, EncounterCreateInput, Vital, Diagnosis, LabResult, Prescription } from './types';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });

export const ehrApi = {
  listEncounters: async (params: any = {}) => {
    const { data } = await api.get('/ehr/encounters', { params });
    return data;
  },
  getEncounter: async (id: number): Promise<Encounter> => {
    const { data } = await api.get(`/ehr/encounters/${id}`);
    return data;
  },
  createEncounter: async (payload: EncounterCreateInput): Promise<Encounter> => {
    const { data } = await api.post('/ehr/encounters', payload);
    return data;
  },
  updateEncounter: async (id: number, payload: any): Promise<Encounter> => {
    const { data } = await api.put(`/ehr/encounters/${id}`, payload);
    return data;
  },
  finalizeEncounter: async (id: number): Promise<Encounter> => {
    const { data } = await api.post(`/ehr/encounters/${id}/finalize`);
    return data;
  },
  soapNote: async (id: number, payload: { subjective: string; objective: string; assessment: string; plan: string }): Promise<Encounter> => {
    const { data } = await api.post(`/ehr/encounters/${id}/soap`, null, { params: payload });
    return data;
  },
  addVital: async (payload: any): Promise<Vital> => {
    const { data } = await api.post('/ehr/vitals', payload);
    return data;
  },
  listVitals: async (encounterId: number): Promise<Vital[]> => {
    const { data } = await api.get(`/ehr/encounters/${encounterId}/vitals`);
    return data;
  },
  addDiagnosis: async (payload: any): Promise<Diagnosis> => {
    const { data } = await api.post('/ehr/diagnoses', payload);
    return data;
  },
  listDiagnoses: async (encounterId: number): Promise<Diagnosis[]> => {
    const { data } = await api.get(`/ehr/encounters/${encounterId}/diagnoses`);
    return data;
  },
  addLabResult: async (payload: any): Promise<LabResult> => {
    const { data } = await api.post('/ehr/lab-results', payload);
    return data;
  },
  listLabResults: async (encounterId: number): Promise<LabResult[]> => {
    const { data } = await api.get(`/ehr/encounters/${encounterId}/lab-results`);
    return data;
  },
  addPrescription: async (payload: any): Promise<Prescription> => {
    const { data } = await api.post('/ehr/prescriptions', payload);
    return data;
  },
  listPrescriptions: async (encounterId: number): Promise<Prescription[]> => {
    const { data } = await api.get(`/ehr/encounters/${encounterId}/prescriptions`);
    return data;
  },
};

export default ehrApi;
