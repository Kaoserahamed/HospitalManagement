import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pain_managementApi } from './api';
import type { PainManagementCreateInput, PainManagementListParams, PainManagementUpdateInput } from './types';

export const pain_managementKeys = {
  all: ['pain_management'] as const,
  list: (params: PainManagementListParams) => ['pain_management', 'list', params] as const,
  detail: (id: number) => ['pain_management', 'detail', id] as const,
  summary: (patientId?: number) => ['pain_management', 'summary', patientId] as const,
};

export function usePainManagementList(params: PainManagementListParams = {}) {
  return useQuery({
    queryKey: pain_managementKeys.list(params),
    queryFn: () => pain_managementApi.list(params),
  });
}

export function usePainManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...pain_managementKeys.all, 'all', patientId],
    queryFn: () => pain_managementApi.getAll(patientId),
  });
}

export function usePainManagement(id: number) {
  return useQuery({
    queryKey: pain_managementKeys.detail(id),
    queryFn: () => pain_managementApi.get(id),
    enabled: !!id,
  });
}

export function usePainManagementCount() {
  return useQuery({
    queryKey: [...pain_managementKeys.all, 'count'],
    queryFn: () => pain_managementApi.count(),
  });
}

export function usePainManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: pain_managementKeys.summary(patientId),
    queryFn: () => pain_managementApi.summary(patientId),
  });
}

export function useCreatePainManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PainManagementCreateInput) => pain_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: pain_managementKeys.all }),
  });
}

export function useUpdatePainManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PainManagementUpdateInput }) => pain_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pain_managementKeys.all });
      qc.invalidateQueries({ queryKey: pain_managementKeys.detail(id) });
    },
  });
}

export function useDeletePainManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pain_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: pain_managementKeys.all }),
  });
}

export function useActivatePainManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pain_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pain_managementKeys.all });
      qc.invalidateQueries({ queryKey: pain_managementKeys.detail(id) });
    },
  });
}

export function useDeactivatePainManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pain_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pain_managementKeys.all });
      qc.invalidateQueries({ queryKey: pain_managementKeys.detail(id) });
    },
  });
}

export function useCompletePainManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => pain_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pain_managementKeys.all });
      qc.invalidateQueries({ queryKey: pain_managementKeys.detail(id) });
    },
  });
}

export function useCancelPainManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => pain_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pain_managementKeys.all });
      qc.invalidateQueries({ queryKey: pain_managementKeys.detail(id) });
    },
  });
}
