import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cardiac_rehabApi } from './api';
import type { CardiacRehabCreateInput, CardiacRehabListParams, CardiacRehabUpdateInput } from './types';

export const cardiac_rehabKeys = {
  all: ['cardiac_rehab'] as const,
  list: (params: CardiacRehabListParams) => ['cardiac_rehab', 'list', params] as const,
  detail: (id: number) => ['cardiac_rehab', 'detail', id] as const,
  summary: (patientId?: number) => ['cardiac_rehab', 'summary', patientId] as const,
};

export function useCardiacRehabList(params: CardiacRehabListParams = {}) {
  return useQuery({
    queryKey: cardiac_rehabKeys.list(params),
    queryFn: () => cardiac_rehabApi.list(params),
  });
}

export function useCardiacRehabAll(patientId?: number) {
  return useQuery({
    queryKey: [...cardiac_rehabKeys.all, 'all', patientId],
    queryFn: () => cardiac_rehabApi.getAll(patientId),
  });
}

export function useCardiacRehab(id: number) {
  return useQuery({
    queryKey: cardiac_rehabKeys.detail(id),
    queryFn: () => cardiac_rehabApi.get(id),
    enabled: !!id,
  });
}

export function useCardiacRehabCount() {
  return useQuery({
    queryKey: [...cardiac_rehabKeys.all, 'count'],
    queryFn: () => cardiac_rehabApi.count(),
  });
}

export function useCardiacRehabSummary(patientId?: number) {
  return useQuery({
    queryKey: cardiac_rehabKeys.summary(patientId),
    queryFn: () => cardiac_rehabApi.summary(patientId),
  });
}

export function useCreateCardiacRehab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CardiacRehabCreateInput) => cardiac_rehabApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: cardiac_rehabKeys.all }),
  });
}

export function useUpdateCardiacRehab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CardiacRehabUpdateInput }) => cardiac_rehabApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.detail(id) });
    },
  });
}

export function useDeleteCardiacRehab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiac_rehabApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: cardiac_rehabKeys.all }),
  });
}

export function useActivateCardiacRehab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiac_rehabApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.detail(id) });
    },
  });
}

export function useDeactivateCardiacRehab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiac_rehabApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.detail(id) });
    },
  });
}

export function useCompleteCardiacRehab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => cardiac_rehabApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.detail(id) });
    },
  });
}

export function useCancelCardiacRehab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => cardiac_rehabApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_rehabKeys.detail(id) });
    },
  });
}
