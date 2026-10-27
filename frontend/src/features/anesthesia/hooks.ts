import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { anesthesiaApi } from './api';
import type { AnesthesiaCreateInput, AnesthesiaListParams, AnesthesiaUpdateInput } from './types';

export const anesthesiaKeys = {
  all: ['anesthesia'] as const,
  list: (params: AnesthesiaListParams) => ['anesthesia', 'list', params] as const,
  detail: (id: number) => ['anesthesia', 'detail', id] as const,
  summary: (patientId?: number) => ['anesthesia', 'summary', patientId] as const,
};

export function useAnesthesiaList(params: AnesthesiaListParams = {}) {
  return useQuery({
    queryKey: anesthesiaKeys.list(params),
    queryFn: () => anesthesiaApi.list(params),
  });
}

export function useAnesthesiaAll(patientId?: number) {
  return useQuery({
    queryKey: [...anesthesiaKeys.all, 'all', patientId],
    queryFn: () => anesthesiaApi.getAll(patientId),
  });
}

export function useAnesthesia(id: number) {
  return useQuery({
    queryKey: anesthesiaKeys.detail(id),
    queryFn: () => anesthesiaApi.get(id),
    enabled: !!id,
  });
}

export function useAnesthesiaCount() {
  return useQuery({
    queryKey: [...anesthesiaKeys.all, 'count'],
    queryFn: () => anesthesiaApi.count(),
  });
}

export function useAnesthesiaSummary(patientId?: number) {
  return useQuery({
    queryKey: anesthesiaKeys.summary(patientId),
    queryFn: () => anesthesiaApi.summary(patientId),
  });
}

export function useCreateAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AnesthesiaCreateInput) => anesthesiaApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: anesthesiaKeys.all }),
  });
}

export function useUpdateAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AnesthesiaUpdateInput }) => anesthesiaApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiaKeys.detail(id) });
    },
  });
}

export function useDeleteAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => anesthesiaApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: anesthesiaKeys.all }),
  });
}

export function useActivateAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => anesthesiaApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiaKeys.detail(id) });
    },
  });
}

export function useDeactivateAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => anesthesiaApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiaKeys.detail(id) });
    },
  });
}

export function useCompleteAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => anesthesiaApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiaKeys.detail(id) });
    },
  });
}

export function useCancelAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => anesthesiaApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiaKeys.detail(id) });
    },
  });
}
