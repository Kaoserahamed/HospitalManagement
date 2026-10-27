import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { business_continuityApi } from './api';
import type { BusinessContinuityCreateInput, BusinessContinuityListParams, BusinessContinuityUpdateInput } from './types';

export const business_continuityKeys = {
  all: ['business_continuity'] as const,
  list: (params: BusinessContinuityListParams) => ['business_continuity', 'list', params] as const,
  detail: (id: number) => ['business_continuity', 'detail', id] as const,
  summary: (patientId?: number) => ['business_continuity', 'summary', patientId] as const,
};

export function useBusinessContinuityList(params: BusinessContinuityListParams = {}) {
  return useQuery({
    queryKey: business_continuityKeys.list(params),
    queryFn: () => business_continuityApi.list(params),
  });
}

export function useBusinessContinuityAll(patientId?: number) {
  return useQuery({
    queryKey: [...business_continuityKeys.all, 'all', patientId],
    queryFn: () => business_continuityApi.getAll(patientId),
  });
}

export function useBusinessContinuity(id: number) {
  return useQuery({
    queryKey: business_continuityKeys.detail(id),
    queryFn: () => business_continuityApi.get(id),
    enabled: !!id,
  });
}

export function useBusinessContinuityCount() {
  return useQuery({
    queryKey: [...business_continuityKeys.all, 'count'],
    queryFn: () => business_continuityApi.count(),
  });
}

export function useBusinessContinuitySummary(patientId?: number) {
  return useQuery({
    queryKey: business_continuityKeys.summary(patientId),
    queryFn: () => business_continuityApi.summary(patientId),
  });
}

export function useCreateBusinessContinuity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BusinessContinuityCreateInput) => business_continuityApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: business_continuityKeys.all }),
  });
}

export function useUpdateBusinessContinuity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BusinessContinuityUpdateInput }) => business_continuityApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: business_continuityKeys.all });
      qc.invalidateQueries({ queryKey: business_continuityKeys.detail(id) });
    },
  });
}

export function useDeleteBusinessContinuity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => business_continuityApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: business_continuityKeys.all }),
  });
}

export function useActivateBusinessContinuity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => business_continuityApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: business_continuityKeys.all });
      qc.invalidateQueries({ queryKey: business_continuityKeys.detail(id) });
    },
  });
}

export function useDeactivateBusinessContinuity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => business_continuityApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: business_continuityKeys.all });
      qc.invalidateQueries({ queryKey: business_continuityKeys.detail(id) });
    },
  });
}

export function useCompleteBusinessContinuity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => business_continuityApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: business_continuityKeys.all });
      qc.invalidateQueries({ queryKey: business_continuityKeys.detail(id) });
    },
  });
}

export function useCancelBusinessContinuity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => business_continuityApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: business_continuityKeys.all });
      qc.invalidateQueries({ queryKey: business_continuityKeys.detail(id) });
    },
  });
}
