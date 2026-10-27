import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blood_bankApi } from './api';
import type { BloodBankCreateInput, BloodBankListParams, BloodBankUpdateInput } from './types';

export const blood_bankKeys = {
  all: ['blood_bank'] as const,
  list: (params: BloodBankListParams) => ['blood_bank', 'list', params] as const,
  detail: (id: number) => ['blood_bank', 'detail', id] as const,
  summary: (patientId?: number) => ['blood_bank', 'summary', patientId] as const,
};

export function useBloodBankList(params: BloodBankListParams = {}) {
  return useQuery({
    queryKey: blood_bankKeys.list(params),
    queryFn: () => blood_bankApi.list(params),
  });
}

export function useBloodBankAll(patientId?: number) {
  return useQuery({
    queryKey: [...blood_bankKeys.all, 'all', patientId],
    queryFn: () => blood_bankApi.getAll(patientId),
  });
}

export function useBloodBank(id: number) {
  return useQuery({
    queryKey: blood_bankKeys.detail(id),
    queryFn: () => blood_bankApi.get(id),
    enabled: !!id,
  });
}

export function useBloodBankCount() {
  return useQuery({
    queryKey: [...blood_bankKeys.all, 'count'],
    queryFn: () => blood_bankApi.count(),
  });
}

export function useBloodBankSummary(patientId?: number) {
  return useQuery({
    queryKey: blood_bankKeys.summary(patientId),
    queryFn: () => blood_bankApi.summary(patientId),
  });
}

export function useCreateBloodBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BloodBankCreateInput) => blood_bankApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: blood_bankKeys.all }),
  });
}

export function useUpdateBloodBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BloodBankUpdateInput }) => blood_bankApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: blood_bankKeys.all });
      qc.invalidateQueries({ queryKey: blood_bankKeys.detail(id) });
    },
  });
}

export function useDeleteBloodBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blood_bankApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: blood_bankKeys.all }),
  });
}

export function useActivateBloodBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blood_bankApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: blood_bankKeys.all });
      qc.invalidateQueries({ queryKey: blood_bankKeys.detail(id) });
    },
  });
}

export function useDeactivateBloodBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blood_bankApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: blood_bankKeys.all });
      qc.invalidateQueries({ queryKey: blood_bankKeys.detail(id) });
    },
  });
}

export function useCompleteBloodBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => blood_bankApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: blood_bankKeys.all });
      qc.invalidateQueries({ queryKey: blood_bankKeys.detail(id) });
    },
  });
}

export function useCancelBloodBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => blood_bankApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: blood_bankKeys.all });
      qc.invalidateQueries({ queryKey: blood_bankKeys.detail(id) });
    },
  });
}
