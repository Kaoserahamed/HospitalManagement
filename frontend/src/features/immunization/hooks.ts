import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { immunizationApi } from './api';
import type { ImmunizationCreateInput, ImmunizationListParams, ImmunizationUpdateInput } from './types';

export const immunizationKeys = {
  all: ['immunization'] as const,
  list: (params: ImmunizationListParams) => ['immunization', 'list', params] as const,
  detail: (id: number) => ['immunization', 'detail', id] as const,
  summary: (patientId?: number) => ['immunization', 'summary', patientId] as const,
};

export function useImmunizationList(params: ImmunizationListParams = {}) {
  return useQuery({
    queryKey: immunizationKeys.list(params),
    queryFn: () => immunizationApi.list(params),
  });
}

export function useImmunizationAll(patientId?: number) {
  return useQuery({
    queryKey: [...immunizationKeys.all, 'all', patientId],
    queryFn: () => immunizationApi.getAll(patientId),
  });
}

export function useImmunization(id: number) {
  return useQuery({
    queryKey: immunizationKeys.detail(id),
    queryFn: () => immunizationApi.get(id),
    enabled: !!id,
  });
}

export function useImmunizationCount() {
  return useQuery({
    queryKey: [...immunizationKeys.all, 'count'],
    queryFn: () => immunizationApi.count(),
  });
}

export function useImmunizationSummary(patientId?: number) {
  return useQuery({
    queryKey: immunizationKeys.summary(patientId),
    queryFn: () => immunizationApi.summary(patientId),
  });
}

export function useCreateImmunization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ImmunizationCreateInput) => immunizationApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: immunizationKeys.all }),
  });
}

export function useUpdateImmunization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ImmunizationUpdateInput }) => immunizationApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: immunizationKeys.all });
      qc.invalidateQueries({ queryKey: immunizationKeys.detail(id) });
    },
  });
}

export function useDeleteImmunization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => immunizationApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: immunizationKeys.all }),
  });
}

export function useActivateImmunization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => immunizationApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: immunizationKeys.all });
      qc.invalidateQueries({ queryKey: immunizationKeys.detail(id) });
    },
  });
}

export function useDeactivateImmunization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => immunizationApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: immunizationKeys.all });
      qc.invalidateQueries({ queryKey: immunizationKeys.detail(id) });
    },
  });
}

export function useCompleteImmunization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => immunizationApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: immunizationKeys.all });
      qc.invalidateQueries({ queryKey: immunizationKeys.detail(id) });
    },
  });
}

export function useCancelImmunization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => immunizationApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: immunizationKeys.all });
      qc.invalidateQueries({ queryKey: immunizationKeys.detail(id) });
    },
  });
}
