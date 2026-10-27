import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { oncologyApi } from './api';
import type { OncologyCreateInput, OncologyListParams, OncologyUpdateInput } from './types';

export const oncologyKeys = {
  all: ['oncology'] as const,
  list: (params: OncologyListParams) => ['oncology', 'list', params] as const,
  detail: (id: number) => ['oncology', 'detail', id] as const,
  summary: (patientId?: number) => ['oncology', 'summary', patientId] as const,
};

export function useOncologyList(params: OncologyListParams = {}) {
  return useQuery({
    queryKey: oncologyKeys.list(params),
    queryFn: () => oncologyApi.list(params),
  });
}

export function useOncologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...oncologyKeys.all, 'all', patientId],
    queryFn: () => oncologyApi.getAll(patientId),
  });
}

export function useOncology(id: number) {
  return useQuery({
    queryKey: oncologyKeys.detail(id),
    queryFn: () => oncologyApi.get(id),
    enabled: !!id,
  });
}

export function useOncologyCount() {
  return useQuery({
    queryKey: [...oncologyKeys.all, 'count'],
    queryFn: () => oncologyApi.count(),
  });
}

export function useOncologySummary(patientId?: number) {
  return useQuery({
    queryKey: oncologyKeys.summary(patientId),
    queryFn: () => oncologyApi.summary(patientId),
  });
}

export function useCreateOncology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OncologyCreateInput) => oncologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: oncologyKeys.all }),
  });
}

export function useUpdateOncology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OncologyUpdateInput }) => oncologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: oncologyKeys.all });
      qc.invalidateQueries({ queryKey: oncologyKeys.detail(id) });
    },
  });
}

export function useDeleteOncology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => oncologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: oncologyKeys.all }),
  });
}

export function useActivateOncology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => oncologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: oncologyKeys.all });
      qc.invalidateQueries({ queryKey: oncologyKeys.detail(id) });
    },
  });
}

export function useDeactivateOncology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => oncologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: oncologyKeys.all });
      qc.invalidateQueries({ queryKey: oncologyKeys.detail(id) });
    },
  });
}

export function useCompleteOncology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => oncologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: oncologyKeys.all });
      qc.invalidateQueries({ queryKey: oncologyKeys.detail(id) });
    },
  });
}

export function useCancelOncology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => oncologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: oncologyKeys.all });
      qc.invalidateQueries({ queryKey: oncologyKeys.detail(id) });
    },
  });
}
