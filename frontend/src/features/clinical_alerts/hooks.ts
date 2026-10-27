import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clinical_alertsApi } from './api';
import type { ClinicalAlertsCreateInput, ClinicalAlertsListParams, ClinicalAlertsUpdateInput } from './types';

export const clinical_alertsKeys = {
  all: ['clinical_alerts'] as const,
  list: (params: ClinicalAlertsListParams) => ['clinical_alerts', 'list', params] as const,
  detail: (id: number) => ['clinical_alerts', 'detail', id] as const,
  summary: (patientId?: number) => ['clinical_alerts', 'summary', patientId] as const,
};

export function useClinicalAlertsList(params: ClinicalAlertsListParams = {}) {
  return useQuery({
    queryKey: clinical_alertsKeys.list(params),
    queryFn: () => clinical_alertsApi.list(params),
  });
}

export function useClinicalAlertsAll(patientId?: number) {
  return useQuery({
    queryKey: [...clinical_alertsKeys.all, 'all', patientId],
    queryFn: () => clinical_alertsApi.getAll(patientId),
  });
}

export function useClinicalAlerts(id: number) {
  return useQuery({
    queryKey: clinical_alertsKeys.detail(id),
    queryFn: () => clinical_alertsApi.get(id),
    enabled: !!id,
  });
}

export function useClinicalAlertsCount() {
  return useQuery({
    queryKey: [...clinical_alertsKeys.all, 'count'],
    queryFn: () => clinical_alertsApi.count(),
  });
}

export function useClinicalAlertsSummary(patientId?: number) {
  return useQuery({
    queryKey: clinical_alertsKeys.summary(patientId),
    queryFn: () => clinical_alertsApi.summary(patientId),
  });
}

export function useCreateClinicalAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ClinicalAlertsCreateInput) => clinical_alertsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinical_alertsKeys.all }),
  });
}

export function useUpdateClinicalAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ClinicalAlertsUpdateInput }) => clinical_alertsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.all });
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.detail(id) });
    },
  });
}

export function useDeleteClinicalAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clinical_alertsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinical_alertsKeys.all }),
  });
}

export function useActivateClinicalAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clinical_alertsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.all });
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.detail(id) });
    },
  });
}

export function useDeactivateClinicalAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clinical_alertsApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.all });
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.detail(id) });
    },
  });
}

export function useCompleteClinicalAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => clinical_alertsApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.all });
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.detail(id) });
    },
  });
}

export function useCancelClinicalAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => clinical_alertsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.all });
      qc.invalidateQueries({ queryKey: clinical_alertsKeys.detail(id) });
    },
  });
}
