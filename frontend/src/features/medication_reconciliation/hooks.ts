import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medication_reconciliationApi } from './api';
import type { MedicationReconciliationCreateInput, MedicationReconciliationListParams, MedicationReconciliationUpdateInput } from './types';

export const medication_reconciliationKeys = {
  all: ['medication_reconciliation'] as const,
  list: (params: MedicationReconciliationListParams) => ['medication_reconciliation', 'list', params] as const,
  detail: (id: number) => ['medication_reconciliation', 'detail', id] as const,
  summary: (patientId?: number) => ['medication_reconciliation', 'summary', patientId] as const,
};

export function useMedicationReconciliationList(params: MedicationReconciliationListParams = {}) {
  return useQuery({
    queryKey: medication_reconciliationKeys.list(params),
    queryFn: () => medication_reconciliationApi.list(params),
  });
}

export function useMedicationReconciliationAll(patientId?: number) {
  return useQuery({
    queryKey: [...medication_reconciliationKeys.all, 'all', patientId],
    queryFn: () => medication_reconciliationApi.getAll(patientId),
  });
}

export function useMedicationReconciliation(id: number) {
  return useQuery({
    queryKey: medication_reconciliationKeys.detail(id),
    queryFn: () => medication_reconciliationApi.get(id),
    enabled: !!id,
  });
}

export function useMedicationReconciliationCount() {
  return useQuery({
    queryKey: [...medication_reconciliationKeys.all, 'count'],
    queryFn: () => medication_reconciliationApi.count(),
  });
}

export function useMedicationReconciliationSummary(patientId?: number) {
  return useQuery({
    queryKey: medication_reconciliationKeys.summary(patientId),
    queryFn: () => medication_reconciliationApi.summary(patientId),
  });
}

export function useCreateMedicationReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MedicationReconciliationCreateInput) => medication_reconciliationApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: medication_reconciliationKeys.all }),
  });
}

export function useUpdateMedicationReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MedicationReconciliationUpdateInput }) => medication_reconciliationApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.all });
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.detail(id) });
    },
  });
}

export function useDeleteMedicationReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_reconciliationApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: medication_reconciliationKeys.all }),
  });
}

export function useActivateMedicationReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_reconciliationApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.all });
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.detail(id) });
    },
  });
}

export function useDeactivateMedicationReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medication_reconciliationApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.all });
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.detail(id) });
    },
  });
}

export function useCompleteMedicationReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => medication_reconciliationApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.all });
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.detail(id) });
    },
  });
}

export function useCancelMedicationReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => medication_reconciliationApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.all });
      qc.invalidateQueries({ queryKey: medication_reconciliationKeys.detail(id) });
    },
  });
}
