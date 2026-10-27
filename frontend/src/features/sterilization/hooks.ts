import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sterilizationApi } from './api';
import type { SterilizationCreateInput, SterilizationListParams, SterilizationUpdateInput } from './types';

export const sterilizationKeys = {
  all: ['sterilization'] as const,
  list: (params: SterilizationListParams) => ['sterilization', 'list', params] as const,
  detail: (id: number) => ['sterilization', 'detail', id] as const,
  summary: (patientId?: number) => ['sterilization', 'summary', patientId] as const,
};

export function useSterilizationList(params: SterilizationListParams = {}) {
  return useQuery({
    queryKey: sterilizationKeys.list(params),
    queryFn: () => sterilizationApi.list(params),
  });
}

export function useSterilizationAll(patientId?: number) {
  return useQuery({
    queryKey: [...sterilizationKeys.all, 'all', patientId],
    queryFn: () => sterilizationApi.getAll(patientId),
  });
}

export function useSterilization(id: number) {
  return useQuery({
    queryKey: sterilizationKeys.detail(id),
    queryFn: () => sterilizationApi.get(id),
    enabled: !!id,
  });
}

export function useSterilizationCount() {
  return useQuery({
    queryKey: [...sterilizationKeys.all, 'count'],
    queryFn: () => sterilizationApi.count(),
  });
}

export function useSterilizationSummary(patientId?: number) {
  return useQuery({
    queryKey: sterilizationKeys.summary(patientId),
    queryFn: () => sterilizationApi.summary(patientId),
  });
}

export function useCreateSterilization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SterilizationCreateInput) => sterilizationApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sterilizationKeys.all }),
  });
}

export function useUpdateSterilization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SterilizationUpdateInput }) => sterilizationApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sterilizationKeys.all });
      qc.invalidateQueries({ queryKey: sterilizationKeys.detail(id) });
    },
  });
}

export function useDeleteSterilization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sterilizationApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: sterilizationKeys.all }),
  });
}

export function useActivateSterilization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sterilizationApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: sterilizationKeys.all });
      qc.invalidateQueries({ queryKey: sterilizationKeys.detail(id) });
    },
  });
}

export function useDeactivateSterilization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sterilizationApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: sterilizationKeys.all });
      qc.invalidateQueries({ queryKey: sterilizationKeys.detail(id) });
    },
  });
}

export function useCompleteSterilization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => sterilizationApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sterilizationKeys.all });
      qc.invalidateQueries({ queryKey: sterilizationKeys.detail(id) });
    },
  });
}

export function useCancelSterilization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => sterilizationApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sterilizationKeys.all });
      qc.invalidateQueries({ queryKey: sterilizationKeys.detail(id) });
    },
  });
}
