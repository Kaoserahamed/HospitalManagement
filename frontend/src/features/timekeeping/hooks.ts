import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timekeepingApi } from './api';
import type { TimekeepingCreateInput, TimekeepingListParams, TimekeepingUpdateInput } from './types';

export const timekeepingKeys = {
  all: ['timekeeping'] as const,
  list: (params: TimekeepingListParams) => ['timekeeping', 'list', params] as const,
  detail: (id: number) => ['timekeeping', 'detail', id] as const,
  summary: (patientId?: number) => ['timekeeping', 'summary', patientId] as const,
};

export function useTimekeepingList(params: TimekeepingListParams = {}) {
  return useQuery({
    queryKey: timekeepingKeys.list(params),
    queryFn: () => timekeepingApi.list(params),
  });
}

export function useTimekeepingAll(patientId?: number) {
  return useQuery({
    queryKey: [...timekeepingKeys.all, 'all', patientId],
    queryFn: () => timekeepingApi.getAll(patientId),
  });
}

export function useTimekeeping(id: number) {
  return useQuery({
    queryKey: timekeepingKeys.detail(id),
    queryFn: () => timekeepingApi.get(id),
    enabled: !!id,
  });
}

export function useTimekeepingCount() {
  return useQuery({
    queryKey: [...timekeepingKeys.all, 'count'],
    queryFn: () => timekeepingApi.count(),
  });
}

export function useTimekeepingSummary(patientId?: number) {
  return useQuery({
    queryKey: timekeepingKeys.summary(patientId),
    queryFn: () => timekeepingApi.summary(patientId),
  });
}

export function useCreateTimekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TimekeepingCreateInput) => timekeepingApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: timekeepingKeys.all }),
  });
}

export function useUpdateTimekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TimekeepingUpdateInput }) => timekeepingApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: timekeepingKeys.all });
      qc.invalidateQueries({ queryKey: timekeepingKeys.detail(id) });
    },
  });
}

export function useDeleteTimekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => timekeepingApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: timekeepingKeys.all }),
  });
}

export function useActivateTimekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => timekeepingApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: timekeepingKeys.all });
      qc.invalidateQueries({ queryKey: timekeepingKeys.detail(id) });
    },
  });
}

export function useDeactivateTimekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => timekeepingApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: timekeepingKeys.all });
      qc.invalidateQueries({ queryKey: timekeepingKeys.detail(id) });
    },
  });
}

export function useCompleteTimekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => timekeepingApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: timekeepingKeys.all });
      qc.invalidateQueries({ queryKey: timekeepingKeys.detail(id) });
    },
  });
}

export function useCancelTimekeeping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => timekeepingApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: timekeepingKeys.all });
      qc.invalidateQueries({ queryKey: timekeepingKeys.detail(id) });
    },
  });
}
