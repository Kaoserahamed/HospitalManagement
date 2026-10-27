import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wearable_integrationApi } from './api';
import type { WearableIntegrationCreateInput, WearableIntegrationListParams, WearableIntegrationUpdateInput } from './types';

export const wearable_integrationKeys = {
  all: ['wearable_integration'] as const,
  list: (params: WearableIntegrationListParams) => ['wearable_integration', 'list', params] as const,
  detail: (id: number) => ['wearable_integration', 'detail', id] as const,
  summary: (patientId?: number) => ['wearable_integration', 'summary', patientId] as const,
};

export function useWearableIntegrationList(params: WearableIntegrationListParams = {}) {
  return useQuery({
    queryKey: wearable_integrationKeys.list(params),
    queryFn: () => wearable_integrationApi.list(params),
  });
}

export function useWearableIntegrationAll(patientId?: number) {
  return useQuery({
    queryKey: [...wearable_integrationKeys.all, 'all', patientId],
    queryFn: () => wearable_integrationApi.getAll(patientId),
  });
}

export function useWearableIntegration(id: number) {
  return useQuery({
    queryKey: wearable_integrationKeys.detail(id),
    queryFn: () => wearable_integrationApi.get(id),
    enabled: !!id,
  });
}

export function useWearableIntegrationCount() {
  return useQuery({
    queryKey: [...wearable_integrationKeys.all, 'count'],
    queryFn: () => wearable_integrationApi.count(),
  });
}

export function useWearableIntegrationSummary(patientId?: number) {
  return useQuery({
    queryKey: wearable_integrationKeys.summary(patientId),
    queryFn: () => wearable_integrationApi.summary(patientId),
  });
}

export function useCreateWearableIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WearableIntegrationCreateInput) => wearable_integrationApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: wearable_integrationKeys.all }),
  });
}

export function useUpdateWearableIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: WearableIntegrationUpdateInput }) => wearable_integrationApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.all });
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.detail(id) });
    },
  });
}

export function useDeleteWearableIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => wearable_integrationApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: wearable_integrationKeys.all }),
  });
}

export function useActivateWearableIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => wearable_integrationApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.all });
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.detail(id) });
    },
  });
}

export function useDeactivateWearableIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => wearable_integrationApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.all });
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.detail(id) });
    },
  });
}

export function useCompleteWearableIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => wearable_integrationApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.all });
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.detail(id) });
    },
  });
}

export function useCancelWearableIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => wearable_integrationApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.all });
      qc.invalidateQueries({ queryKey: wearable_integrationKeys.detail(id) });
    },
  });
}
