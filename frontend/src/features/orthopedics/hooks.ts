import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orthopedicsApi } from './api';
import type { OrthopedicsCreateInput, OrthopedicsListParams, OrthopedicsUpdateInput } from './types';

export const orthopedicsKeys = {
  all: ['orthopedics'] as const,
  list: (params: OrthopedicsListParams) => ['orthopedics', 'list', params] as const,
  detail: (id: number) => ['orthopedics', 'detail', id] as const,
  summary: (patientId?: number) => ['orthopedics', 'summary', patientId] as const,
};

export function useOrthopedicsList(params: OrthopedicsListParams = {}) {
  return useQuery({
    queryKey: orthopedicsKeys.list(params),
    queryFn: () => orthopedicsApi.list(params),
  });
}

export function useOrthopedicsAll(patientId?: number) {
  return useQuery({
    queryKey: [...orthopedicsKeys.all, 'all', patientId],
    queryFn: () => orthopedicsApi.getAll(patientId),
  });
}

export function useOrthopedics(id: number) {
  return useQuery({
    queryKey: orthopedicsKeys.detail(id),
    queryFn: () => orthopedicsApi.get(id),
    enabled: !!id,
  });
}

export function useOrthopedicsCount() {
  return useQuery({
    queryKey: [...orthopedicsKeys.all, 'count'],
    queryFn: () => orthopedicsApi.count(),
  });
}

export function useOrthopedicsSummary(patientId?: number) {
  return useQuery({
    queryKey: orthopedicsKeys.summary(patientId),
    queryFn: () => orthopedicsApi.summary(patientId),
  });
}

export function useCreateOrthopedics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrthopedicsCreateInput) => orthopedicsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: orthopedicsKeys.all }),
  });
}

export function useUpdateOrthopedics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OrthopedicsUpdateInput }) => orthopedicsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: orthopedicsKeys.all });
      qc.invalidateQueries({ queryKey: orthopedicsKeys.detail(id) });
    },
  });
}

export function useDeleteOrthopedics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orthopedicsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orthopedicsKeys.all }),
  });
}

export function useActivateOrthopedics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orthopedicsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: orthopedicsKeys.all });
      qc.invalidateQueries({ queryKey: orthopedicsKeys.detail(id) });
    },
  });
}

export function useDeactivateOrthopedics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orthopedicsApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: orthopedicsKeys.all });
      qc.invalidateQueries({ queryKey: orthopedicsKeys.detail(id) });
    },
  });
}

export function useCompleteOrthopedics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => orthopedicsApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: orthopedicsKeys.all });
      qc.invalidateQueries({ queryKey: orthopedicsKeys.detail(id) });
    },
  });
}

export function useCancelOrthopedics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => orthopedicsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: orthopedicsKeys.all });
      qc.invalidateQueries({ queryKey: orthopedicsKeys.detail(id) });
    },
  });
}
