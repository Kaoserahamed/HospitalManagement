import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bed_managementApi } from './api';
import type { BedManagementCreateInput, BedManagementListParams, BedManagementUpdateInput } from './types';

export const bed_managementKeys = {
  all: ['bed_management'] as const,
  list: (params: BedManagementListParams) => ['bed_management', 'list', params] as const,
  detail: (id: number) => ['bed_management', 'detail', id] as const,
  summary: (patientId?: number) => ['bed_management', 'summary', patientId] as const,
};

export function useBedManagementList(params: BedManagementListParams = {}) {
  return useQuery({
    queryKey: bed_managementKeys.list(params),
    queryFn: () => bed_managementApi.list(params),
  });
}

export function useBedManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...bed_managementKeys.all, 'all', patientId],
    queryFn: () => bed_managementApi.getAll(patientId),
  });
}

export function useBedManagement(id: number) {
  return useQuery({
    queryKey: bed_managementKeys.detail(id),
    queryFn: () => bed_managementApi.get(id),
    enabled: !!id,
  });
}

export function useBedManagementCount() {
  return useQuery({
    queryKey: [...bed_managementKeys.all, 'count'],
    queryFn: () => bed_managementApi.count(),
  });
}

export function useBedManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: bed_managementKeys.summary(patientId),
    queryFn: () => bed_managementApi.summary(patientId),
  });
}

export function useCreateBedManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BedManagementCreateInput) => bed_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: bed_managementKeys.all }),
  });
}

export function useUpdateBedManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BedManagementUpdateInput }) => bed_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: bed_managementKeys.all });
      qc.invalidateQueries({ queryKey: bed_managementKeys.detail(id) });
    },
  });
}

export function useDeleteBedManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bed_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bed_managementKeys.all }),
  });
}

export function useActivateBedManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bed_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: bed_managementKeys.all });
      qc.invalidateQueries({ queryKey: bed_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateBedManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bed_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: bed_managementKeys.all });
      qc.invalidateQueries({ queryKey: bed_managementKeys.detail(id) });
    },
  });
}

export function useCompleteBedManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => bed_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: bed_managementKeys.all });
      qc.invalidateQueries({ queryKey: bed_managementKeys.detail(id) });
    },
  });
}

export function useCancelBedManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => bed_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: bed_managementKeys.all });
      qc.invalidateQueries({ queryKey: bed_managementKeys.detail(id) });
    },
  });
}
