import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { maintenanceApi } from './api';
import type { MaintenanceCreateInput, MaintenanceListParams, MaintenanceUpdateInput } from './types';

export const maintenanceKeys = {
  all: ['maintenance'] as const,
  list: (params: MaintenanceListParams) => ['maintenance', 'list', params] as const,
  detail: (id: number) => ['maintenance', 'detail', id] as const,
  summary: (patientId?: number) => ['maintenance', 'summary', patientId] as const,
};

export function useMaintenanceList(params: MaintenanceListParams = {}) {
  return useQuery({
    queryKey: maintenanceKeys.list(params),
    queryFn: () => maintenanceApi.list(params),
  });
}

export function useMaintenanceAll(patientId?: number) {
  return useQuery({
    queryKey: [...maintenanceKeys.all, 'all', patientId],
    queryFn: () => maintenanceApi.getAll(patientId),
  });
}

export function useMaintenance(id: number) {
  return useQuery({
    queryKey: maintenanceKeys.detail(id),
    queryFn: () => maintenanceApi.get(id),
    enabled: !!id,
  });
}

export function useMaintenanceCount() {
  return useQuery({
    queryKey: [...maintenanceKeys.all, 'count'],
    queryFn: () => maintenanceApi.count(),
  });
}

export function useMaintenanceSummary(patientId?: number) {
  return useQuery({
    queryKey: maintenanceKeys.summary(patientId),
    queryFn: () => maintenanceApi.summary(patientId),
  });
}

export function useCreateMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MaintenanceCreateInput) => maintenanceApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: maintenanceKeys.all }),
  });
}

export function useUpdateMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MaintenanceUpdateInput }) => maintenanceApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: maintenanceKeys.all });
      qc.invalidateQueries({ queryKey: maintenanceKeys.detail(id) });
    },
  });
}

export function useDeleteMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => maintenanceApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: maintenanceKeys.all }),
  });
}

export function useActivateMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => maintenanceApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: maintenanceKeys.all });
      qc.invalidateQueries({ queryKey: maintenanceKeys.detail(id) });
    },
  });
}

export function useDeactivateMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => maintenanceApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: maintenanceKeys.all });
      qc.invalidateQueries({ queryKey: maintenanceKeys.detail(id) });
    },
  });
}

export function useCompleteMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => maintenanceApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: maintenanceKeys.all });
      qc.invalidateQueries({ queryKey: maintenanceKeys.detail(id) });
    },
  });
}

export function useCancelMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => maintenanceApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: maintenanceKeys.all });
      qc.invalidateQueries({ queryKey: maintenanceKeys.detail(id) });
    },
  });
}
