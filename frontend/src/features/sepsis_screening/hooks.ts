import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sepsis_screeningApi } from './api';
import type { SepsisScreeningCreateInput, SepsisScreeningListParams, SepsisScreeningUpdateInput } from './types';

export const sepsis_screeningKeys = {
  all: ['sepsis_screening'] as const,
  list: (params: SepsisScreeningListParams) => ['sepsis_screening', 'list', params] as const,
  detail: (id: number) => ['sepsis_screening', 'detail', id] as const,
  summary: (patientId?: number) => ['sepsis_screening', 'summary', patientId] as const,
};

export function useSepsisScreeningList(params: SepsisScreeningListParams = {}) {
  return useQuery({
    queryKey: sepsis_screeningKeys.list(params),
    queryFn: () => sepsis_screeningApi.list(params),
  });
}

export function useSepsisScreeningAll(patientId?: number) {
  return useQuery({
    queryKey: [...sepsis_screeningKeys.all, 'all', patientId],
    queryFn: () => sepsis_screeningApi.getAll(patientId),
  });
}

export function useSepsisScreening(id: number) {
  return useQuery({
    queryKey: sepsis_screeningKeys.detail(id),
    queryFn: () => sepsis_screeningApi.get(id),
    enabled: !!id,
  });
}

export function useSepsisScreeningCount() {
  return useQuery({
    queryKey: [...sepsis_screeningKeys.all, 'count'],
    queryFn: () => sepsis_screeningApi.count(),
  });
}

export function useSepsisScreeningSummary(patientId?: number) {
  return useQuery({
    queryKey: sepsis_screeningKeys.summary(patientId),
    queryFn: () => sepsis_screeningApi.summary(patientId),
  });
}

export function useCreateSepsisScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SepsisScreeningCreateInput) => sepsis_screeningApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sepsis_screeningKeys.all }),
  });
}

export function useUpdateSepsisScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SepsisScreeningUpdateInput }) => sepsis_screeningApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.all });
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.detail(id) });
    },
  });
}

export function useDeleteSepsisScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sepsis_screeningApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: sepsis_screeningKeys.all }),
  });
}

export function useActivateSepsisScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sepsis_screeningApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.all });
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.detail(id) });
    },
  });
}

export function useDeactivateSepsisScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sepsis_screeningApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.all });
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.detail(id) });
    },
  });
}

export function useCompleteSepsisScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => sepsis_screeningApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.all });
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.detail(id) });
    },
  });
}

export function useCancelSepsisScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => sepsis_screeningApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.all });
      qc.invalidateQueries({ queryKey: sepsis_screeningKeys.detail(id) });
    },
  });
}
