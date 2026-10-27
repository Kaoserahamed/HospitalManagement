import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cardiologyApi } from './api';
import type { CardiologyCreateInput, CardiologyListParams, CardiologyUpdateInput } from './types';

export const cardiologyKeys = {
  all: ['cardiology'] as const,
  list: (params: CardiologyListParams) => ['cardiology', 'list', params] as const,
  detail: (id: number) => ['cardiology', 'detail', id] as const,
  summary: (patientId?: number) => ['cardiology', 'summary', patientId] as const,
};

export function useCardiologyList(params: CardiologyListParams = {}) {
  return useQuery({
    queryKey: cardiologyKeys.list(params),
    queryFn: () => cardiologyApi.list(params),
  });
}

export function useCardiologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...cardiologyKeys.all, 'all', patientId],
    queryFn: () => cardiologyApi.getAll(patientId),
  });
}

export function useCardiology(id: number) {
  return useQuery({
    queryKey: cardiologyKeys.detail(id),
    queryFn: () => cardiologyApi.get(id),
    enabled: !!id,
  });
}

export function useCardiologyCount() {
  return useQuery({
    queryKey: [...cardiologyKeys.all, 'count'],
    queryFn: () => cardiologyApi.count(),
  });
}

export function useCardiologySummary(patientId?: number) {
  return useQuery({
    queryKey: cardiologyKeys.summary(patientId),
    queryFn: () => cardiologyApi.summary(patientId),
  });
}

export function useCreateCardiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CardiologyCreateInput) => cardiologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: cardiologyKeys.all }),
  });
}

export function useUpdateCardiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CardiologyUpdateInput }) => cardiologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiologyKeys.all });
      qc.invalidateQueries({ queryKey: cardiologyKeys.detail(id) });
    },
  });
}

export function useDeleteCardiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: cardiologyKeys.all }),
  });
}

export function useActivateCardiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: cardiologyKeys.all });
      qc.invalidateQueries({ queryKey: cardiologyKeys.detail(id) });
    },
  });
}

export function useDeactivateCardiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cardiologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: cardiologyKeys.all });
      qc.invalidateQueries({ queryKey: cardiologyKeys.detail(id) });
    },
  });
}

export function useCompleteCardiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => cardiologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiologyKeys.all });
      qc.invalidateQueries({ queryKey: cardiologyKeys.detail(id) });
    },
  });
}

export function useCancelCardiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => cardiologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: cardiologyKeys.all });
      qc.invalidateQueries({ queryKey: cardiologyKeys.detail(id) });
    },
  });
}
