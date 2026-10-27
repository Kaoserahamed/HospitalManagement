import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lab_qaApi } from './api';
import type { LabQaCreateInput, LabQaListParams, LabQaUpdateInput } from './types';

export const lab_qaKeys = {
  all: ['lab_qa'] as const,
  list: (params: LabQaListParams) => ['lab_qa', 'list', params] as const,
  detail: (id: number) => ['lab_qa', 'detail', id] as const,
  summary: (patientId?: number) => ['lab_qa', 'summary', patientId] as const,
};

export function useLabQaList(params: LabQaListParams = {}) {
  return useQuery({
    queryKey: lab_qaKeys.list(params),
    queryFn: () => lab_qaApi.list(params),
  });
}

export function useLabQaAll(patientId?: number) {
  return useQuery({
    queryKey: [...lab_qaKeys.all, 'all', patientId],
    queryFn: () => lab_qaApi.getAll(patientId),
  });
}

export function useLabQa(id: number) {
  return useQuery({
    queryKey: lab_qaKeys.detail(id),
    queryFn: () => lab_qaApi.get(id),
    enabled: !!id,
  });
}

export function useLabQaCount() {
  return useQuery({
    queryKey: [...lab_qaKeys.all, 'count'],
    queryFn: () => lab_qaApi.count(),
  });
}

export function useLabQaSummary(patientId?: number) {
  return useQuery({
    queryKey: lab_qaKeys.summary(patientId),
    queryFn: () => lab_qaApi.summary(patientId),
  });
}

export function useCreateLabQa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LabQaCreateInput) => lab_qaApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: lab_qaKeys.all }),
  });
}

export function useUpdateLabQa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: LabQaUpdateInput }) => lab_qaApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: lab_qaKeys.all });
      qc.invalidateQueries({ queryKey: lab_qaKeys.detail(id) });
    },
  });
}

export function useDeleteLabQa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lab_qaApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: lab_qaKeys.all }),
  });
}

export function useActivateLabQa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lab_qaApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: lab_qaKeys.all });
      qc.invalidateQueries({ queryKey: lab_qaKeys.detail(id) });
    },
  });
}

export function useDeactivateLabQa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lab_qaApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: lab_qaKeys.all });
      qc.invalidateQueries({ queryKey: lab_qaKeys.detail(id) });
    },
  });
}

export function useCompleteLabQa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => lab_qaApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: lab_qaKeys.all });
      qc.invalidateQueries({ queryKey: lab_qaKeys.detail(id) });
    },
  });
}

export function useCancelLabQa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => lab_qaApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: lab_qaKeys.all });
      qc.invalidateQueries({ queryKey: lab_qaKeys.detail(id) });
    },
  });
}
