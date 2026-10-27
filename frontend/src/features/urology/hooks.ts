import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { urologyApi } from './api';
import type { UrologyCreateInput, UrologyListParams, UrologyUpdateInput } from './types';

export const urologyKeys = {
  all: ['urology'] as const,
  list: (params: UrologyListParams) => ['urology', 'list', params] as const,
  detail: (id: number) => ['urology', 'detail', id] as const,
  summary: (patientId?: number) => ['urology', 'summary', patientId] as const,
};

export function useUrologyList(params: UrologyListParams = {}) {
  return useQuery({
    queryKey: urologyKeys.list(params),
    queryFn: () => urologyApi.list(params),
  });
}

export function useUrologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...urologyKeys.all, 'all', patientId],
    queryFn: () => urologyApi.getAll(patientId),
  });
}

export function useUrology(id: number) {
  return useQuery({
    queryKey: urologyKeys.detail(id),
    queryFn: () => urologyApi.get(id),
    enabled: !!id,
  });
}

export function useUrologyCount() {
  return useQuery({
    queryKey: [...urologyKeys.all, 'count'],
    queryFn: () => urologyApi.count(),
  });
}

export function useUrologySummary(patientId?: number) {
  return useQuery({
    queryKey: urologyKeys.summary(patientId),
    queryFn: () => urologyApi.summary(patientId),
  });
}

export function useCreateUrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UrologyCreateInput) => urologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: urologyKeys.all }),
  });
}

export function useUpdateUrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UrologyUpdateInput }) => urologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: urologyKeys.all });
      qc.invalidateQueries({ queryKey: urologyKeys.detail(id) });
    },
  });
}

export function useDeleteUrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => urologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: urologyKeys.all }),
  });
}

export function useActivateUrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => urologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: urologyKeys.all });
      qc.invalidateQueries({ queryKey: urologyKeys.detail(id) });
    },
  });
}

export function useDeactivateUrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => urologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: urologyKeys.all });
      qc.invalidateQueries({ queryKey: urologyKeys.detail(id) });
    },
  });
}

export function useCompleteUrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => urologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: urologyKeys.all });
      qc.invalidateQueries({ queryKey: urologyKeys.detail(id) });
    },
  });
}

export function useCancelUrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => urologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: urologyKeys.all });
      qc.invalidateQueries({ queryKey: urologyKeys.detail(id) });
    },
  });
}
