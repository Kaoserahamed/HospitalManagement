import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medical_recordsApi } from './api';
import type { MedicalRecordsCreateInput, MedicalRecordsListParams, MedicalRecordsUpdateInput } from './types';

export const medical_recordsKeys = {
  all: ['medical_records'] as const,
  list: (params: MedicalRecordsListParams) => ['medical_records', 'list', params] as const,
  detail: (id: number) => ['medical_records', 'detail', id] as const,
  summary: (patientId?: number) => ['medical_records', 'summary', patientId] as const,
};

export function useMedicalRecordsList(params: MedicalRecordsListParams = {}) {
  return useQuery({
    queryKey: medical_recordsKeys.list(params),
    queryFn: () => medical_recordsApi.list(params),
  });
}

export function useMedicalRecordsAll(patientId?: number) {
  return useQuery({
    queryKey: [...medical_recordsKeys.all, 'all', patientId],
    queryFn: () => medical_recordsApi.getAll(patientId),
  });
}

export function useMedicalRecords(id: number) {
  return useQuery({
    queryKey: medical_recordsKeys.detail(id),
    queryFn: () => medical_recordsApi.get(id),
    enabled: !!id,
  });
}

export function useMedicalRecordsCount() {
  return useQuery({
    queryKey: [...medical_recordsKeys.all, 'count'],
    queryFn: () => medical_recordsApi.count(),
  });
}

export function useMedicalRecordsSummary(patientId?: number) {
  return useQuery({
    queryKey: medical_recordsKeys.summary(patientId),
    queryFn: () => medical_recordsApi.summary(patientId),
  });
}

export function useCreateMedicalRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MedicalRecordsCreateInput) => medical_recordsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: medical_recordsKeys.all }),
  });
}

export function useUpdateMedicalRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MedicalRecordsUpdateInput }) => medical_recordsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medical_recordsKeys.all });
      qc.invalidateQueries({ queryKey: medical_recordsKeys.detail(id) });
    },
  });
}

export function useDeleteMedicalRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medical_recordsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: medical_recordsKeys.all }),
  });
}

export function useActivateMedicalRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medical_recordsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: medical_recordsKeys.all });
      qc.invalidateQueries({ queryKey: medical_recordsKeys.detail(id) });
    },
  });
}

export function useDeactivateMedicalRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medical_recordsApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: medical_recordsKeys.all });
      qc.invalidateQueries({ queryKey: medical_recordsKeys.detail(id) });
    },
  });
}

export function useCompleteMedicalRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => medical_recordsApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medical_recordsKeys.all });
      qc.invalidateQueries({ queryKey: medical_recordsKeys.detail(id) });
    },
  });
}

export function useCancelMedicalRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => medical_recordsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: medical_recordsKeys.all });
      qc.invalidateQueries({ queryKey: medical_recordsKeys.detail(id) });
    },
  });
}
