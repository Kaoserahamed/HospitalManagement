import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transfusionApi } from './api';
import type { TransfusionCreateInput, TransfusionListParams, TransfusionUpdateInput } from './types';

export const transfusionKeys = {
  all: ['transfusion'] as const,
  list: (params: TransfusionListParams) => ['transfusion', 'list', params] as const,
  detail: (id: number) => ['transfusion', 'detail', id] as const,
  summary: (patientId?: number) => ['transfusion', 'summary', patientId] as const,
};

export function useTransfusionList(params: TransfusionListParams = {}) {
  return useQuery({
    queryKey: transfusionKeys.list(params),
    queryFn: () => transfusionApi.list(params),
  });
}

export function useTransfusionAll(patientId?: number) {
  return useQuery({
    queryKey: [...transfusionKeys.all, 'all', patientId],
    queryFn: () => transfusionApi.getAll(patientId),
  });
}

export function useTransfusion(id: number) {
  return useQuery({
    queryKey: transfusionKeys.detail(id),
    queryFn: () => transfusionApi.get(id),
    enabled: !!id,
  });
}

export function useTransfusionCount() {
  return useQuery({
    queryKey: [...transfusionKeys.all, 'count'],
    queryFn: () => transfusionApi.count(),
  });
}

export function useTransfusionSummary(patientId?: number) {
  return useQuery({
    queryKey: transfusionKeys.summary(patientId),
    queryFn: () => transfusionApi.summary(patientId),
  });
}

export function useCreateTransfusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransfusionCreateInput) => transfusionApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: transfusionKeys.all }),
  });
}

export function useUpdateTransfusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TransfusionUpdateInput }) => transfusionApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: transfusionKeys.all });
      qc.invalidateQueries({ queryKey: transfusionKeys.detail(id) });
    },
  });
}

export function useDeleteTransfusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transfusionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: transfusionKeys.all }),
  });
}

export function useActivateTransfusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transfusionApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: transfusionKeys.all });
      qc.invalidateQueries({ queryKey: transfusionKeys.detail(id) });
    },
  });
}

export function useDeactivateTransfusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transfusionApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: transfusionKeys.all });
      qc.invalidateQueries({ queryKey: transfusionKeys.detail(id) });
    },
  });
}

export function useCompleteTransfusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => transfusionApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: transfusionKeys.all });
      qc.invalidateQueries({ queryKey: transfusionKeys.detail(id) });
    },
  });
}

export function useCancelTransfusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => transfusionApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: transfusionKeys.all });
      qc.invalidateQueries({ queryKey: transfusionKeys.detail(id) });
    },
  });
}
