import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cardiac_surgeryApi } from './api';
import type { CardiacSurgeryCreateInput, CardiacSurgeryListParams, CardiacSurgeryUpdateInput } from './types';

export const cardiac_surgeryKeys = {
  all: ['cardiac_surgery'] as const,
  list: (params: CardiacSurgeryListParams) => ['cardiac_surgery', 'list', params] as const,
  detail: (id: number) => ['cardiac_surgery', 'detail', id] as const,
  summary: (patientId?: number) => ['cardiac_surgery', 'summary', patientId] as const,
};

export function useCardiacSurgeryList(params: CardiacSurgeryListParams = {}) {
  return useQuery({
    queryKey: cardiac_surgeryKeys.list(params),
    queryFn: () => cardiac_surgeryApi.list(params),
  });
}

export function useCardiacSurgeryAll(patientId?: number) {
  return useQuery({
    queryKey: [...cardiac_surgeryKeys.all, 'all', patientId],
    queryFn: () => cardiac_surgeryApi.getAll(patientId),
  });
}

export function useCardiacSurgery(id: number) {
  return useQuery({
    queryKey: cardiac_surgeryKeys.detail(id),
    queryFn: () => cardiac_surgeryApi.get(id),
    enabled: !!id,
  });
}

export function useCardiacSurgeryCount() {
  return useQuery({
    queryKey: [...cardiac_surgeryKeys.all, 'count'],
    queryFn: () => cardiac_surgeryApi.count(),
  });
}

export function useCardiacSurgerySummary(patientId?: number) {
  return useQuery({
    queryKey: cardiac_surgeryKeys.summary(patientId),
    queryFn: () => cardiac_surgeryApi.summary(patientId),
  });
}

export function useCreateCardiacSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CardiacSurgeryCreateInput) => cardiac_surgeryApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.all }),
  });
}

export function useUpdateCardiacSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CardiacSurgeryUpdateInput }) => cardiac_surgeryApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.detail(id) });
    },
  });
}

export function useDeleteCardiacSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiac_surgeryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.all }),
  });
}

export function useActivateCardiacSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiac_surgeryApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.detail(id) });
    },
  });
}

export function useDeactivateCardiacSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiac_surgeryApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.detail(id) });
    },
  });
}

export function useCompleteCardiacSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => cardiac_surgeryApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.detail(id) });
    },
  });
}

export function useCancelCardiacSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => cardiac_surgeryApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: cardiac_surgeryKeys.detail(id) });
    },
  });
}
