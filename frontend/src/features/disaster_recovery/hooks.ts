import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { disaster_recoveryApi } from './api';
import type { DisasterRecoveryCreateInput, DisasterRecoveryListParams, DisasterRecoveryUpdateInput } from './types';

export const disaster_recoveryKeys = {
  all: ['disaster_recovery'] as const,
  list: (params: DisasterRecoveryListParams) => ['disaster_recovery', 'list', params] as const,
  detail: (id: number) => ['disaster_recovery', 'detail', id] as const,
  summary: (patientId?: number) => ['disaster_recovery', 'summary', patientId] as const,
};

export function useDisasterRecoveryList(params: DisasterRecoveryListParams = {}) {
  return useQuery({
    queryKey: disaster_recoveryKeys.list(params),
    queryFn: () => disaster_recoveryApi.list(params),
  });
}

export function useDisasterRecoveryAll(patientId?: number) {
  return useQuery({
    queryKey: [...disaster_recoveryKeys.all, 'all', patientId],
    queryFn: () => disaster_recoveryApi.getAll(patientId),
  });
}

export function useDisasterRecovery(id: number) {
  return useQuery({
    queryKey: disaster_recoveryKeys.detail(id),
    queryFn: () => disaster_recoveryApi.get(id),
    enabled: !!id,
  });
}

export function useDisasterRecoveryCount() {
  return useQuery({
    queryKey: [...disaster_recoveryKeys.all, 'count'],
    queryFn: () => disaster_recoveryApi.count(),
  });
}

export function useDisasterRecoverySummary(patientId?: number) {
  return useQuery({
    queryKey: disaster_recoveryKeys.summary(patientId),
    queryFn: () => disaster_recoveryApi.summary(patientId),
  });
}

export function useCreateDisasterRecovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DisasterRecoveryCreateInput) => disaster_recoveryApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: disaster_recoveryKeys.all }),
  });
}

export function useUpdateDisasterRecovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DisasterRecoveryUpdateInput }) => disaster_recoveryApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.all });
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.detail(id) });
    },
  });
}

export function useDeleteDisasterRecovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => disaster_recoveryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: disaster_recoveryKeys.all }),
  });
}

export function useActivateDisasterRecovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => disaster_recoveryApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.all });
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.detail(id) });
    },
  });
}

export function useDeactivateDisasterRecovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => disaster_recoveryApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.all });
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.detail(id) });
    },
  });
}

export function useCompleteDisasterRecovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => disaster_recoveryApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.all });
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.detail(id) });
    },
  });
}

export function useCancelDisasterRecovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => disaster_recoveryApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.all });
      qc.invalidateQueries({ queryKey: disaster_recoveryKeys.detail(id) });
    },
  });
}
