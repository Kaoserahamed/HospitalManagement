import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { release_of_infoApi } from './api';
import type { ReleaseOfInfoCreateInput, ReleaseOfInfoListParams, ReleaseOfInfoUpdateInput } from './types';

export const release_of_infoKeys = {
  all: ['release_of_info'] as const,
  list: (params: ReleaseOfInfoListParams) => ['release_of_info', 'list', params] as const,
  detail: (id: number) => ['release_of_info', 'detail', id] as const,
  summary: (patientId?: number) => ['release_of_info', 'summary', patientId] as const,
};

export function useReleaseOfInfoList(params: ReleaseOfInfoListParams = {}) {
  return useQuery({
    queryKey: release_of_infoKeys.list(params),
    queryFn: () => release_of_infoApi.list(params),
  });
}

export function useReleaseOfInfoAll(patientId?: number) {
  return useQuery({
    queryKey: [...release_of_infoKeys.all, 'all', patientId],
    queryFn: () => release_of_infoApi.getAll(patientId),
  });
}

export function useReleaseOfInfo(id: number) {
  return useQuery({
    queryKey: release_of_infoKeys.detail(id),
    queryFn: () => release_of_infoApi.get(id),
    enabled: !!id,
  });
}

export function useReleaseOfInfoCount() {
  return useQuery({
    queryKey: [...release_of_infoKeys.all, 'count'],
    queryFn: () => release_of_infoApi.count(),
  });
}

export function useReleaseOfInfoSummary(patientId?: number) {
  return useQuery({
    queryKey: release_of_infoKeys.summary(patientId),
    queryFn: () => release_of_infoApi.summary(patientId),
  });
}

export function useCreateReleaseOfInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReleaseOfInfoCreateInput) => release_of_infoApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: release_of_infoKeys.all }),
  });
}

export function useUpdateReleaseOfInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ReleaseOfInfoUpdateInput }) => release_of_infoApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: release_of_infoKeys.all });
      qc.invalidateQueries({ queryKey: release_of_infoKeys.detail(id) });
    },
  });
}

export function useDeleteReleaseOfInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => release_of_infoApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: release_of_infoKeys.all }),
  });
}

export function useActivateReleaseOfInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => release_of_infoApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: release_of_infoKeys.all });
      qc.invalidateQueries({ queryKey: release_of_infoKeys.detail(id) });
    },
  });
}

export function useDeactivateReleaseOfInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => release_of_infoApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: release_of_infoKeys.all });
      qc.invalidateQueries({ queryKey: release_of_infoKeys.detail(id) });
    },
  });
}

export function useCompleteReleaseOfInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => release_of_infoApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: release_of_infoKeys.all });
      qc.invalidateQueries({ queryKey: release_of_infoKeys.detail(id) });
    },
  });
}

export function useCancelReleaseOfInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => release_of_infoApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: release_of_infoKeys.all });
      qc.invalidateQueries({ queryKey: release_of_infoKeys.detail(id) });
    },
  });
}
