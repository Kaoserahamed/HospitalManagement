import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { housekeepingApi } from './api';
import type { HousekeepingCreateInput, HousekeepingListParams, HousekeepingUpdateInput } from './types';

export const housekeepingKeys = {
  all: ['housekeeping'] as const,
  list: (params: HousekeepingListParams) => ['housekeeping', 'list', params] as const,
  detail: (id: number) => ['housekeeping', 'detail', id] as const,
  summary: (patientId?: number) => ['housekeeping', 'summary', patientId] as const,
};

export function useHousekeepingList(params: HousekeepingListParams = {}) {
  return useQuery({
    queryKey: housekeepingKeys.list(params),
    queryFn: () => housekeepingApi.list(params),
  });
}

export function useHousekeepingAll(patientId?: number) {
  return useQuery({
    queryKey: [...housekeepingKeys.all, 'all', patientId],
    queryFn: () => housekeepingApi.getAll(patientId),
  });
}

export function useHousekeeping(id: number) {
  return useQuery({
    queryKey: housekeepingKeys.detail(id),
    queryFn: () => housekeepingApi.get(id),
    enabled: !!id,
  });
}

export function useHousekeepingCount() {
  return useQuery({
    queryKey: [...housekeepingKeys.all, 'count'],
    queryFn: () => housekeepingApi.count(),
  });
}

export function useHousekeepingSummary(patientId?: number) {
  return useQuery({
    queryKey: housekeepingKeys.summary(patientId),
    queryFn: () => housekeepingApi.summary(patientId),
  });
}

export function useCreateHousekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: HousekeepingCreateInput) => housekeepingApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: housekeepingKeys.all }),
  });
}

export function useUpdateHousekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: HousekeepingUpdateInput }) => housekeepingApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: housekeepingKeys.all });
      qc.invalidateQueries({ queryKey: housekeepingKeys.detail(id) });
    },
  });
}

export function useDeleteHousekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => housekeepingApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: housekeepingKeys.all }),
  });
}

export function useActivateHousekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => housekeepingApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: housekeepingKeys.all });
      qc.invalidateQueries({ queryKey: housekeepingKeys.detail(id) });
    },
  });
}

export function useDeactivateHousekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => housekeepingApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: housekeepingKeys.all });
      qc.invalidateQueries({ queryKey: housekeepingKeys.detail(id) });
    },
  });
}

export function useCompleteHousekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => housekeepingApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: housekeepingKeys.all });
      qc.invalidateQueries({ queryKey: housekeepingKeys.detail(id) });
    },
  });
}

export function useCancelHousekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => housekeepingApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: housekeepingKeys.all });
      qc.invalidateQueries({ queryKey: housekeepingKeys.detail(id) });
    },
  });
}
