import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medication_safetyApi } from './api';
import type { MedicationSafetyCreateInput, MedicationSafetyListParams, MedicationSafetyUpdateInput } from './types';

export const medication_safetyKeys = {
  all: ['medication_safety'] as const,
  list: (params: MedicationSafetyListParams) => ['medication_safety', 'list', params] as const,
  detail: (id: number) => ['medication_safety', 'detail', id] as const,
  summary: (patientId?: number) => ['medication_safety', 'summary', patientId] as const,
};

export function useMedicationSafetyList(params: MedicationSafetyListParams = {}) {
  return useQuery({
    queryKey: medication_safetyKeys.list(params),
    queryFn: () => medication_safetyApi.list(params),
  });
}

export function useMedicationSafetyAll(patientId?: number) {
  return useQuery({
    queryKey: [...medication_safetyKeys.all, 'all', patientId],
    queryFn: () => medication_safetyApi.getAll(patientId),
  });
}

export function useMedicationSafety(id: number) {
  return useQuery({
    queryKey: medication_safetyKeys.detail(id),
    queryFn: () => medication_safetyApi.get(id),
    enabled: !!id,
  });
}

export function useMedicationSafetyCount() {
  return useQuery({
    queryKey: [...medication_safetyKeys.all, 'count'],
    queryFn: () => medication_safetyApi.count(),
  });
}

export function useMedicationSafetySummary(patientId?: number) {
  return useQuery({
    queryKey: medication_safetyKeys.summary(patientId),
    queryFn: () => medication_safetyApi.summary(patientId),
  });
}

export function useCreateMedicationSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MedicationSafetyCreateInput) => medication_safetyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: medication_safetyKeys.all }),
  });
}

export function useUpdateMedicationSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MedicationSafetyUpdateInput }) => medication_safetyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_safetyKeys.all });
      qc.invalidateQueries({ queryKey: medication_safetyKeys.detail(id) });
    },
  });
}

export function useDeleteMedicationSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_safetyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: medication_safetyKeys.all }),
  });
}

export function useActivateMedicationSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_safetyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: medication_safetyKeys.all });
      qc.invalidateQueries({ queryKey: medication_safetyKeys.detail(id) });
    },
  });
}

export function useDeactivateMedicationSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_safetyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: medication_safetyKeys.all });
      qc.invalidateQueries({ queryKey: medication_safetyKeys.detail(id) });
    },
  });
}

export function useCompleteMedicationSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => medication_safetyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_safetyKeys.all });
      qc.invalidateQueries({ queryKey: medication_safetyKeys.detail(id) });
    },
  });
}

export function useCancelMedicationSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => medication_safetyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_safetyKeys.all });
      qc.invalidateQueries({ queryKey: medication_safetyKeys.detail(id) });
    },
  });
}
