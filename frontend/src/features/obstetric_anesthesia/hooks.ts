import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { obstetric_anesthesiaApi } from './api';
import type { ObstetricAnesthesiaCreateInput, ObstetricAnesthesiaListParams, ObstetricAnesthesiaUpdateInput } from './types';

export const obstetric_anesthesiaKeys = {
  all: ['obstetric_anesthesia'] as const,
  list: (params: ObstetricAnesthesiaListParams) => ['obstetric_anesthesia', 'list', params] as const,
  detail: (id: number) => ['obstetric_anesthesia', 'detail', id] as const,
  summary: (patientId?: number) => ['obstetric_anesthesia', 'summary', patientId] as const,
};

export function useObstetricAnesthesiaList(params: ObstetricAnesthesiaListParams = {}) {
  return useQuery({
    queryKey: obstetric_anesthesiaKeys.list(params),
    queryFn: () => obstetric_anesthesiaApi.list(params),
  });
}

export function useObstetricAnesthesiaAll(patientId?: number) {
  return useQuery({
    queryKey: [...obstetric_anesthesiaKeys.all, 'all', patientId],
    queryFn: () => obstetric_anesthesiaApi.getAll(patientId),
  });
}

export function useObstetricAnesthesia(id: number) {
  return useQuery({
    queryKey: obstetric_anesthesiaKeys.detail(id),
    queryFn: () => obstetric_anesthesiaApi.get(id),
    enabled: !!id,
  });
}

export function useObstetricAnesthesiaCount() {
  return useQuery({
    queryKey: [...obstetric_anesthesiaKeys.all, 'count'],
    queryFn: () => obstetric_anesthesiaApi.count(),
  });
}

export function useObstetricAnesthesiaSummary(patientId?: number) {
  return useQuery({
    queryKey: obstetric_anesthesiaKeys.summary(patientId),
    queryFn: () => obstetric_anesthesiaApi.summary(patientId),
  });
}

export function useCreateObstetricAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ObstetricAnesthesiaCreateInput) => obstetric_anesthesiaApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.all }),
  });
}

export function useUpdateObstetricAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ObstetricAnesthesiaUpdateInput }) => obstetric_anesthesiaApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.detail(id) });
    },
  });
}

export function useDeleteObstetricAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => obstetric_anesthesiaApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.all }),
  });
}

export function useActivateObstetricAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => obstetric_anesthesiaApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.detail(id) });
    },
  });
}

export function useDeactivateObstetricAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => obstetric_anesthesiaApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.detail(id) });
    },
  });
}

export function useCompleteObstetricAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => obstetric_anesthesiaApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.detail(id) });
    },
  });
}

export function useCancelObstetricAnesthesia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => obstetric_anesthesiaApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.all });
      qc.invalidateQueries({ queryKey: obstetric_anesthesiaKeys.detail(id) });
    },
  });
}
