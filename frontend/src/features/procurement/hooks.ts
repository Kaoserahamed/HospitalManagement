import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { procurementApi } from './api';
import type { ProcurementCreateInput, ProcurementListParams, ProcurementUpdateInput } from './types';

export const procurementKeys = {
  all: ['procurement'] as const,
  list: (params: ProcurementListParams) => ['procurement', 'list', params] as const,
  detail: (id: number) => ['procurement', 'detail', id] as const,
  summary: (patientId?: number) => ['procurement', 'summary', patientId] as const,
};

export function useProcurementList(params: ProcurementListParams = {}) {
  return useQuery({
    queryKey: procurementKeys.list(params),
    queryFn: () => procurementApi.list(params),
  });
}

export function useProcurementAll(patientId?: number) {
  return useQuery({
    queryKey: [...procurementKeys.all, 'all', patientId],
    queryFn: () => procurementApi.getAll(patientId),
  });
}

export function useProcurement(id: number) {
  return useQuery({
    queryKey: procurementKeys.detail(id),
    queryFn: () => procurementApi.get(id),
    enabled: !!id,
  });
}

export function useProcurementCount() {
  return useQuery({
    queryKey: [...procurementKeys.all, 'count'],
    queryFn: () => procurementApi.count(),
  });
}

export function useProcurementSummary(patientId?: number) {
  return useQuery({
    queryKey: procurementKeys.summary(patientId),
    queryFn: () => procurementApi.summary(patientId),
  });
}

export function useCreateProcurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProcurementCreateInput) => procurementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: procurementKeys.all }),
  });
}

export function useUpdateProcurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProcurementUpdateInput }) => procurementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: procurementKeys.all });
      qc.invalidateQueries({ queryKey: procurementKeys.detail(id) });
    },
  });
}

export function useDeleteProcurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => procurementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: procurementKeys.all }),
  });
}

export function useActivateProcurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => procurementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: procurementKeys.all });
      qc.invalidateQueries({ queryKey: procurementKeys.detail(id) });
    },
  });
}

export function useDeactivateProcurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => procurementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: procurementKeys.all });
      qc.invalidateQueries({ queryKey: procurementKeys.detail(id) });
    },
  });
}

export function useCompleteProcurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => procurementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: procurementKeys.all });
      qc.invalidateQueries({ queryKey: procurementKeys.detail(id) });
    },
  });
}

export function useCancelProcurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => procurementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: procurementKeys.all });
      qc.invalidateQueries({ queryKey: procurementKeys.detail(id) });
    },
  });
}
