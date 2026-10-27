import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rehabilitationApi } from './api';
import type { RehabilitationCreateInput, RehabilitationListParams, RehabilitationUpdateInput } from './types';

export const rehabilitationKeys = {
  all: ['rehabilitation'] as const,
  list: (params: RehabilitationListParams) => ['rehabilitation', 'list', params] as const,
  detail: (id: number) => ['rehabilitation', 'detail', id] as const,
  summary: (patientId?: number) => ['rehabilitation', 'summary', patientId] as const,
};

export function useRehabilitationList(params: RehabilitationListParams = {}) {
  return useQuery({
    queryKey: rehabilitationKeys.list(params),
    queryFn: () => rehabilitationApi.list(params),
  });
}

export function useRehabilitationAll(patientId?: number) {
  return useQuery({
    queryKey: [...rehabilitationKeys.all, 'all', patientId],
    queryFn: () => rehabilitationApi.getAll(patientId),
  });
}

export function useRehabilitation(id: number) {
  return useQuery({
    queryKey: rehabilitationKeys.detail(id),
    queryFn: () => rehabilitationApi.get(id),
    enabled: !!id,
  });
}

export function useRehabilitationCount() {
  return useQuery({
    queryKey: [...rehabilitationKeys.all, 'count'],
    queryFn: () => rehabilitationApi.count(),
  });
}

export function useRehabilitationSummary(patientId?: number) {
  return useQuery({
    queryKey: rehabilitationKeys.summary(patientId),
    queryFn: () => rehabilitationApi.summary(patientId),
  });
}

export function useCreateRehabilitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RehabilitationCreateInput) => rehabilitationApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: rehabilitationKeys.all }),
  });
}

export function useUpdateRehabilitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RehabilitationUpdateInput }) => rehabilitationApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: rehabilitationKeys.all });
      qc.invalidateQueries({ queryKey: rehabilitationKeys.detail(id) });
    },
  });
}

export function useDeleteRehabilitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rehabilitationApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: rehabilitationKeys.all }),
  });
}

export function useActivateRehabilitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rehabilitationApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: rehabilitationKeys.all });
      qc.invalidateQueries({ queryKey: rehabilitationKeys.detail(id) });
    },
  });
}

export function useDeactivateRehabilitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rehabilitationApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: rehabilitationKeys.all });
      qc.invalidateQueries({ queryKey: rehabilitationKeys.detail(id) });
    },
  });
}

export function useCompleteRehabilitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => rehabilitationApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: rehabilitationKeys.all });
      qc.invalidateQueries({ queryKey: rehabilitationKeys.detail(id) });
    },
  });
}

export function useCancelRehabilitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => rehabilitationApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: rehabilitationKeys.all });
      qc.invalidateQueries({ queryKey: rehabilitationKeys.detail(id) });
    },
  });
}
