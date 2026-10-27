import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gastroenterologyApi } from './api';
import type { GastroenterologyCreateInput, GastroenterologyListParams, GastroenterologyUpdateInput } from './types';

export const gastroenterologyKeys = {
  all: ['gastroenterology'] as const,
  list: (params: GastroenterologyListParams) => ['gastroenterology', 'list', params] as const,
  detail: (id: number) => ['gastroenterology', 'detail', id] as const,
  summary: (patientId?: number) => ['gastroenterology', 'summary', patientId] as const,
};

export function useGastroenterologyList(params: GastroenterologyListParams = {}) {
  return useQuery({
    queryKey: gastroenterologyKeys.list(params),
    queryFn: () => gastroenterologyApi.list(params),
  });
}

export function useGastroenterologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...gastroenterologyKeys.all, 'all', patientId],
    queryFn: () => gastroenterologyApi.getAll(patientId),
  });
}

export function useGastroenterology(id: number) {
  return useQuery({
    queryKey: gastroenterologyKeys.detail(id),
    queryFn: () => gastroenterologyApi.get(id),
    enabled: !!id,
  });
}

export function useGastroenterologyCount() {
  return useQuery({
    queryKey: [...gastroenterologyKeys.all, 'count'],
    queryFn: () => gastroenterologyApi.count(),
  });
}

export function useGastroenterologySummary(patientId?: number) {
  return useQuery({
    queryKey: gastroenterologyKeys.summary(patientId),
    queryFn: () => gastroenterologyApi.summary(patientId),
  });
}

export function useCreateGastroenterology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GastroenterologyCreateInput) => gastroenterologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: gastroenterologyKeys.all }),
  });
}

export function useUpdateGastroenterology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GastroenterologyUpdateInput }) => gastroenterologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.all });
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.detail(id) });
    },
  });
}

export function useDeleteGastroenterology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gastroenterologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: gastroenterologyKeys.all }),
  });
}

export function useActivateGastroenterology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gastroenterologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.all });
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.detail(id) });
    },
  });
}

export function useDeactivateGastroenterology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gastroenterologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.all });
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.detail(id) });
    },
  });
}

export function useCompleteGastroenterology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => gastroenterologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.all });
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.detail(id) });
    },
  });
}

export function useCancelGastroenterology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => gastroenterologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.all });
      qc.invalidateQueries({ queryKey: gastroenterologyKeys.detail(id) });
    },
  });
}
