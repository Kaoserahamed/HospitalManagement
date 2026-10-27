import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { remote_monitoringApi } from './api';
import type { RemoteMonitoringCreateInput, RemoteMonitoringListParams, RemoteMonitoringUpdateInput } from './types';

export const remote_monitoringKeys = {
  all: ['remote_monitoring'] as const,
  list: (params: RemoteMonitoringListParams) => ['remote_monitoring', 'list', params] as const,
  detail: (id: number) => ['remote_monitoring', 'detail', id] as const,
  summary: (patientId?: number) => ['remote_monitoring', 'summary', patientId] as const,
};

export function useRemoteMonitoringList(params: RemoteMonitoringListParams = {}) {
  return useQuery({
    queryKey: remote_monitoringKeys.list(params),
    queryFn: () => remote_monitoringApi.list(params),
  });
}

export function useRemoteMonitoringAll(patientId?: number) {
  return useQuery({
    queryKey: [...remote_monitoringKeys.all, 'all', patientId],
    queryFn: () => remote_monitoringApi.getAll(patientId),
  });
}

export function useRemoteMonitoring(id: number) {
  return useQuery({
    queryKey: remote_monitoringKeys.detail(id),
    queryFn: () => remote_monitoringApi.get(id),
    enabled: !!id,
  });
}

export function useRemoteMonitoringCount() {
  return useQuery({
    queryKey: [...remote_monitoringKeys.all, 'count'],
    queryFn: () => remote_monitoringApi.count(),
  });
}

export function useRemoteMonitoringSummary(patientId?: number) {
  return useQuery({
    queryKey: remote_monitoringKeys.summary(patientId),
    queryFn: () => remote_monitoringApi.summary(patientId),
  });
}

export function useCreateRemoteMonitoring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RemoteMonitoringCreateInput) => remote_monitoringApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: remote_monitoringKeys.all }),
  });
}

export function useUpdateRemoteMonitoring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RemoteMonitoringUpdateInput }) => remote_monitoringApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.all });
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.detail(id) });
    },
  });
}

export function useDeleteRemoteMonitoring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => remote_monitoringApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: remote_monitoringKeys.all }),
  });
}

export function useActivateRemoteMonitoring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => remote_monitoringApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.all });
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.detail(id) });
    },
  });
}

export function useDeactivateRemoteMonitoring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => remote_monitoringApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.all });
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.detail(id) });
    },
  });
}

export function useCompleteRemoteMonitoring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => remote_monitoringApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.all });
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.detail(id) });
    },
  });
}

export function useCancelRemoteMonitoring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => remote_monitoringApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.all });
      qc.invalidateQueries({ queryKey: remote_monitoringKeys.detail(id) });
    },
  });
}
