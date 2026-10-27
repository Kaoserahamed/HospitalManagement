import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ehrApi } from './api';

export const ehrKeys = {
  all: ['ehr'] as const,
  encounters: (params: any) => ['ehr', 'encounters', params] as const,
  encounter: (id: number) => ['ehr', 'encounter', id] as const,
  vitals: (id: number) => ['ehr', 'vitals', id] as const,
  diagnoses: (id: number) => ['ehr', 'diagnoses', id] as const,
  labs: (id: number) => ['ehr', 'labs', id] as const,
  prescriptions: (id: number) => ['ehr', 'prescriptions', id] as const,
};

export function useEncounters(params: any = {}) {
  return useQuery({ queryKey: ehrKeys.encounters(params), queryFn: () => ehrApi.listEncounters(params) });
}

export function useEncounter(id: number) {
  return useQuery({ queryKey: ehrKeys.encounter(id), queryFn: () => ehrApi.getEncounter(id), enabled: !!id });
}

export function useCreateEncounter() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => ehrApi.createEncounter(p), onSuccess: () => qc.invalidateQueries({ queryKey: ehrKeys.all }) });
}

export function useFinalizeEncounter() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => ehrApi.finalizeEncounter(id), onSuccess: () => qc.invalidateQueries({ queryKey: ehrKeys.all }) });
}

export function useAddVital() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => ehrApi.addVital(p), onSuccess: (d: any) => qc.invalidateQueries({ queryKey: ehrKeys.vitals(d.encounter_id) }) });
}

export function useAddDiagnosis() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => ehrApi.addDiagnosis(p), onSuccess: (d: any) => qc.invalidateQueries({ queryKey: ehrKeys.diagnoses(d.encounter_id) }) });
}

export function useAddPrescription() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => ehrApi.addPrescription(p), onSuccess: (d: any) => qc.invalidateQueries({ queryKey: ehrKeys.prescriptions(d.encounter_id) }) });
}
