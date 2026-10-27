import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { offboardingApi } from './api';
import type { OffboardingCreateInput, OffboardingListParams, OffboardingUpdateInput } from './types';

export const offboardingKeys = {
  all: ['offboarding'] as const,
  list: (params: OffboardingListParams) => ['offboarding', 'list', params] as const,
  detail: (id: number) => ['offboarding', 'detail', id] as const,
  summary: (patientId?: number) => ['offboarding', 'summary', patientId] as const,
};

export function useOffboardingList(params: OffboardingListParams = {}) {
  return useQuery({
    queryKey: offboardingKeys.list(params),
    queryFn: () => offboardingApi.list(params),
  });
}

export function useOffboardingAll(patientId?: number) {
  return useQuery({
    queryKey: [...offboardingKeys.all, 'all', patientId],
    queryFn: () => offboardingApi.getAll(patientId),
  });
}

export function useOffboarding(id: number) {
  return useQuery({
    queryKey: offboardingKeys.detail(id),
    queryFn: () => offboardingApi.get(id),
    enabled: !!id,
  });
}

export function useOffboardingCount() {
  return useQuery({
    queryKey: [...offboardingKeys.all, 'count'],
    queryFn: () => offboardingApi.count(),
  });
}

export function useOffboardingSummary(patientId?: number) {
  return useQuery({
    queryKey: offboardingKeys.summary(patientId),
    queryFn: () => offboardingApi.summary(patientId),
  });
}

export function useCreateOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OffboardingCreateInput) => offboardingApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: offboardingKeys.all }),
  });
}

export function useUpdateOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OffboardingUpdateInput }) => offboardingApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: offboardingKeys.all });
      qc.invalidateQueries({ queryKey: offboardingKeys.detail(id) });
    },
  });
}

export function useDeleteOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => offboardingApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: offboardingKeys.all }),
  });
}

export function useActivateOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => offboardingApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: offboardingKeys.all });
      qc.invalidateQueries({ queryKey: offboardingKeys.detail(id) });
    },
  });
}

export function useDeactivateOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => offboardingApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: offboardingKeys.all });
      qc.invalidateQueries({ queryKey: offboardingKeys.detail(id) });
    },
  });
}

export function useCompleteOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => offboardingApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: offboardingKeys.all });
      qc.invalidateQueries({ queryKey: offboardingKeys.detail(id) });
    },
  });
}

export function useCancelOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => offboardingApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: offboardingKeys.all });
      qc.invalidateQueries({ queryKey: offboardingKeys.detail(id) });
    },
  });
}
