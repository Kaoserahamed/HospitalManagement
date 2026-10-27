import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medication_adherenceApi } from './api';
import type { MedicationAdherenceCreateInput, MedicationAdherenceListParams, MedicationAdherenceUpdateInput } from './types';

export const medication_adherenceKeys = {
  all: ['medication_adherence'] as const,
  list: (params: MedicationAdherenceListParams) => ['medication_adherence', 'list', params] as const,
  detail: (id: number) => ['medication_adherence', 'detail', id] as const,
  summary: (patientId?: number) => ['medication_adherence', 'summary', patientId] as const,
};

export function useMedicationAdherenceList(params: MedicationAdherenceListParams = {}) {
  return useQuery({
    queryKey: medication_adherenceKeys.list(params),
    queryFn: () => medication_adherenceApi.list(params),
  });
}

export function useMedicationAdherenceAll(patientId?: number) {
  return useQuery({
    queryKey: [...medication_adherenceKeys.all, 'all', patientId],
    queryFn: () => medication_adherenceApi.getAll(patientId),
  });
}

export function useMedicationAdherence(id: number) {
  return useQuery({
    queryKey: medication_adherenceKeys.detail(id),
    queryFn: () => medication_adherenceApi.get(id),
    enabled: !!id,
  });
}

export function useMedicationAdherenceCount() {
  return useQuery({
    queryKey: [...medication_adherenceKeys.all, 'count'],
    queryFn: () => medication_adherenceApi.count(),
  });
}

export function useMedicationAdherenceSummary(patientId?: number) {
  return useQuery({
    queryKey: medication_adherenceKeys.summary(patientId),
    queryFn: () => medication_adherenceApi.summary(patientId),
  });
}

export function useCreateMedicationAdherence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MedicationAdherenceCreateInput) => medication_adherenceApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: medication_adherenceKeys.all }),
  });
}

export function useUpdateMedicationAdherence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MedicationAdherenceUpdateInput }) => medication_adherenceApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.all });
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.detail(id) });
    },
  });
}

export function useDeleteMedicationAdherence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_adherenceApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: medication_adherenceKeys.all }),
  });
}

export function useActivateMedicationAdherence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_adherenceApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.all });
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.detail(id) });
    },
  });
}

export function useDeactivateMedicationAdherence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_adherenceApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.all });
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.detail(id) });
    },
  });
}

export function useCompleteMedicationAdherence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => medication_adherenceApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.all });
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.detail(id) });
    },
  });
}

export function useCancelMedicationAdherence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => medication_adherenceApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.all });
      qc.invalidateQueries({ queryKey: medication_adherenceKeys.detail(id) });
    },
  });
}
