import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { psychiatryApi } from './api';
import type { PsychiatryCreateInput, PsychiatryListParams, PsychiatryUpdateInput } from './types';

export const psychiatryKeys = {
  all: ['psychiatry'] as const,
  list: (params: PsychiatryListParams) => ['psychiatry', 'list', params] as const,
  detail: (id: number) => ['psychiatry', 'detail', id] as const,
  summary: (patientId?: number) => ['psychiatry', 'summary', patientId] as const,
};

export function usePsychiatryList(params: PsychiatryListParams = {}) {
  return useQuery({
    queryKey: psychiatryKeys.list(params),
    queryFn: () => psychiatryApi.list(params),
  });
}

export function usePsychiatryAll(patientId?: number) {
  return useQuery({
    queryKey: [...psychiatryKeys.all, 'all', patientId],
    queryFn: () => psychiatryApi.getAll(patientId),
  });
}

export function usePsychiatry(id: number) {
  return useQuery({
    queryKey: psychiatryKeys.detail(id),
    queryFn: () => psychiatryApi.get(id),
    enabled: !!id,
  });
}

export function usePsychiatryCount() {
  return useQuery({
    queryKey: [...psychiatryKeys.all, 'count'],
    queryFn: () => psychiatryApi.count(),
  });
}

export function usePsychiatrySummary(patientId?: number) {
  return useQuery({
    queryKey: psychiatryKeys.summary(patientId),
    queryFn: () => psychiatryApi.summary(patientId),
  });
}

export function useCreatePsychiatry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PsychiatryCreateInput) => psychiatryApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: psychiatryKeys.all }),
  });
}

export function useUpdatePsychiatry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PsychiatryUpdateInput }) => psychiatryApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: psychiatryKeys.all });
      qc.invalidateQueries({ queryKey: psychiatryKeys.detail(id) });
    },
  });
}

export function useDeletePsychiatry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => psychiatryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: psychiatryKeys.all }),
  });
}

export function useActivatePsychiatry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => psychiatryApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: psychiatryKeys.all });
      qc.invalidateQueries({ queryKey: psychiatryKeys.detail(id) });
    },
  });
}

export function useDeactivatePsychiatry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => psychiatryApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: psychiatryKeys.all });
      qc.invalidateQueries({ queryKey: psychiatryKeys.detail(id) });
    },
  });
}

export function useCompletePsychiatry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => psychiatryApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: psychiatryKeys.all });
      qc.invalidateQueries({ queryKey: psychiatryKeys.detail(id) });
    },
  });
}

export function useCancelPsychiatry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => psychiatryApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: psychiatryKeys.all });
      qc.invalidateQueries({ queryKey: psychiatryKeys.detail(id) });
    },
  });
}
