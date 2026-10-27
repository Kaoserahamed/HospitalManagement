import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { emergency_preparednessApi } from './api';
import type { EmergencyPreparednessCreateInput, EmergencyPreparednessListParams, EmergencyPreparednessUpdateInput } from './types';

export const emergency_preparednessKeys = {
  all: ['emergency_preparedness'] as const,
  list: (params: EmergencyPreparednessListParams) => ['emergency_preparedness', 'list', params] as const,
  detail: (id: number) => ['emergency_preparedness', 'detail', id] as const,
  summary: (patientId?: number) => ['emergency_preparedness', 'summary', patientId] as const,
};

export function useEmergencyPreparednessList(params: EmergencyPreparednessListParams = {}) {
  return useQuery({
    queryKey: emergency_preparednessKeys.list(params),
    queryFn: () => emergency_preparednessApi.list(params),
  });
}

export function useEmergencyPreparednessAll(patientId?: number) {
  return useQuery({
    queryKey: [...emergency_preparednessKeys.all, 'all', patientId],
    queryFn: () => emergency_preparednessApi.getAll(patientId),
  });
}

export function useEmergencyPreparedness(id: number) {
  return useQuery({
    queryKey: emergency_preparednessKeys.detail(id),
    queryFn: () => emergency_preparednessApi.get(id),
    enabled: !!id,
  });
}

export function useEmergencyPreparednessCount() {
  return useQuery({
    queryKey: [...emergency_preparednessKeys.all, 'count'],
    queryFn: () => emergency_preparednessApi.count(),
  });
}

export function useEmergencyPreparednessSummary(patientId?: number) {
  return useQuery({
    queryKey: emergency_preparednessKeys.summary(patientId),
    queryFn: () => emergency_preparednessApi.summary(patientId),
  });
}

export function useCreateEmergencyPreparedness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmergencyPreparednessCreateInput) => emergency_preparednessApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: emergency_preparednessKeys.all }),
  });
}

export function useUpdateEmergencyPreparedness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EmergencyPreparednessUpdateInput }) => emergency_preparednessApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.all });
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.detail(id) });
    },
  });
}

export function useDeleteEmergencyPreparedness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => emergency_preparednessApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: emergency_preparednessKeys.all }),
  });
}

export function useActivateEmergencyPreparedness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => emergency_preparednessApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.all });
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.detail(id) });
    },
  });
}

export function useDeactivateEmergencyPreparedness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => emergency_preparednessApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.all });
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.detail(id) });
    },
  });
}

export function useCompleteEmergencyPreparedness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => emergency_preparednessApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.all });
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.detail(id) });
    },
  });
}

export function useCancelEmergencyPreparedness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => emergency_preparednessApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.all });
      qc.invalidateQueries({ queryKey: emergency_preparednessKeys.detail(id) });
    },
  });
}
