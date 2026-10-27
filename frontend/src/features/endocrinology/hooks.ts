import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endocrinologyApi } from './api';
import type { EndocrinologyCreateInput, EndocrinologyListParams, EndocrinologyUpdateInput } from './types';

export const endocrinologyKeys = {
  all: ['endocrinology'] as const,
  list: (params: EndocrinologyListParams) => ['endocrinology', 'list', params] as const,
  detail: (id: number) => ['endocrinology', 'detail', id] as const,
  summary: (patientId?: number) => ['endocrinology', 'summary', patientId] as const,
};

export function useEndocrinologyList(params: EndocrinologyListParams = {}) {
  return useQuery({
    queryKey: endocrinologyKeys.list(params),
    queryFn: () => endocrinologyApi.list(params),
  });
}

export function useEndocrinologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...endocrinologyKeys.all, 'all', patientId],
    queryFn: () => endocrinologyApi.getAll(patientId),
  });
}

export function useEndocrinology(id: number) {
  return useQuery({
    queryKey: endocrinologyKeys.detail(id),
    queryFn: () => endocrinologyApi.get(id),
    enabled: !!id,
  });
}

export function useEndocrinologyCount() {
  return useQuery({
    queryKey: [...endocrinologyKeys.all, 'count'],
    queryFn: () => endocrinologyApi.count(),
  });
}

export function useEndocrinologySummary(patientId?: number) {
  return useQuery({
    queryKey: endocrinologyKeys.summary(patientId),
    queryFn: () => endocrinologyApi.summary(patientId),
  });
}

export function useCreateEndocrinology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EndocrinologyCreateInput) => endocrinologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: endocrinologyKeys.all }),
  });
}

export function useUpdateEndocrinology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EndocrinologyUpdateInput }) => endocrinologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: endocrinologyKeys.all });
      qc.invalidateQueries({ queryKey: endocrinologyKeys.detail(id) });
    },
  });
}

export function useDeleteEndocrinology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => endocrinologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: endocrinologyKeys.all }),
  });
}

export function useActivateEndocrinology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => endocrinologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: endocrinologyKeys.all });
      qc.invalidateQueries({ queryKey: endocrinologyKeys.detail(id) });
    },
  });
}

export function useDeactivateEndocrinology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => endocrinologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: endocrinologyKeys.all });
      qc.invalidateQueries({ queryKey: endocrinologyKeys.detail(id) });
    },
  });
}

export function useCompleteEndocrinology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => endocrinologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: endocrinologyKeys.all });
      qc.invalidateQueries({ queryKey: endocrinologyKeys.detail(id) });
    },
  });
}

export function useCancelEndocrinology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => endocrinologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: endocrinologyKeys.all });
      qc.invalidateQueries({ queryKey: endocrinologyKeys.detail(id) });
    },
  });
}
