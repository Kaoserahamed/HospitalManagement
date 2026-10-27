import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { privilegingApi } from './api';
import type { PrivilegingCreateInput, PrivilegingListParams, PrivilegingUpdateInput } from './types';

export const privilegingKeys = {
  all: ['privileging'] as const,
  list: (params: PrivilegingListParams) => ['privileging', 'list', params] as const,
  detail: (id: number) => ['privileging', 'detail', id] as const,
  summary: (patientId?: number) => ['privileging', 'summary', patientId] as const,
};

export function usePrivilegingList(params: PrivilegingListParams = {}) {
  return useQuery({
    queryKey: privilegingKeys.list(params),
    queryFn: () => privilegingApi.list(params),
  });
}

export function usePrivilegingAll(patientId?: number) {
  return useQuery({
    queryKey: [...privilegingKeys.all, 'all', patientId],
    queryFn: () => privilegingApi.getAll(patientId),
  });
}

export function usePrivileging(id: number) {
  return useQuery({
    queryKey: privilegingKeys.detail(id),
    queryFn: () => privilegingApi.get(id),
    enabled: !!id,
  });
}

export function usePrivilegingCount() {
  return useQuery({
    queryKey: [...privilegingKeys.all, 'count'],
    queryFn: () => privilegingApi.count(),
  });
}

export function usePrivilegingSummary(patientId?: number) {
  return useQuery({
    queryKey: privilegingKeys.summary(patientId),
    queryFn: () => privilegingApi.summary(patientId),
  });
}

export function useCreatePrivileging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PrivilegingCreateInput) => privilegingApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: privilegingKeys.all }),
  });
}

export function useUpdatePrivileging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PrivilegingUpdateInput }) => privilegingApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: privilegingKeys.all });
      qc.invalidateQueries({ queryKey: privilegingKeys.detail(id) });
    },
  });
}

export function useDeletePrivileging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => privilegingApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: privilegingKeys.all }),
  });
}

export function useActivatePrivileging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => privilegingApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: privilegingKeys.all });
      qc.invalidateQueries({ queryKey: privilegingKeys.detail(id) });
    },
  });
}

export function useDeactivatePrivileging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => privilegingApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: privilegingKeys.all });
      qc.invalidateQueries({ queryKey: privilegingKeys.detail(id) });
    },
  });
}

export function useCompletePrivileging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => privilegingApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: privilegingKeys.all });
      qc.invalidateQueries({ queryKey: privilegingKeys.detail(id) });
    },
  });
}

export function useCancelPrivileging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => privilegingApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: privilegingKeys.all });
      qc.invalidateQueries({ queryKey: privilegingKeys.detail(id) });
    },
  });
}
