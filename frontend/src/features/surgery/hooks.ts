import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { surgeryApi } from './api';
import type { SurgeryCreateInput, SurgeryListParams, SurgeryUpdateInput } from './types';

export const surgeryKeys = {
  all: ['surgery'] as const,
  list: (params: SurgeryListParams) => ['surgery', 'list', params] as const,
  detail: (id: number) => ['surgery', 'detail', id] as const,
  summary: (patientId?: number) => ['surgery', 'summary', patientId] as const,
};

export function useSurgeryList(params: SurgeryListParams = {}) {
  return useQuery({
    queryKey: surgeryKeys.list(params),
    queryFn: () => surgeryApi.list(params),
  });
}

export function useSurgeryAll(patientId?: number) {
  return useQuery({
    queryKey: [...surgeryKeys.all, 'all', patientId],
    queryFn: () => surgeryApi.getAll(patientId),
  });
}

export function useSurgery(id: number) {
  return useQuery({
    queryKey: surgeryKeys.detail(id),
    queryFn: () => surgeryApi.get(id),
    enabled: !!id,
  });
}

export function useSurgeryCount() {
  return useQuery({
    queryKey: [...surgeryKeys.all, 'count'],
    queryFn: () => surgeryApi.count(),
  });
}

export function useSurgerySummary(patientId?: number) {
  return useQuery({
    queryKey: surgeryKeys.summary(patientId),
    queryFn: () => surgeryApi.summary(patientId),
  });
}

export function useCreateSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SurgeryCreateInput) => surgeryApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: surgeryKeys.all }),
  });
}

export function useUpdateSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SurgeryUpdateInput }) => surgeryApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: surgeryKeys.all });
      qc.invalidateQueries({ queryKey: surgeryKeys.detail(id) });
    },
  });
}

export function useDeleteSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => surgeryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: surgeryKeys.all }),
  });
}

export function useActivateSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => surgeryApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: surgeryKeys.all });
      qc.invalidateQueries({ queryKey: surgeryKeys.detail(id) });
    },
  });
}

export function useDeactivateSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => surgeryApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: surgeryKeys.all });
      qc.invalidateQueries({ queryKey: surgeryKeys.detail(id) });
    },
  });
}

export function useCompleteSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => surgeryApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: surgeryKeys.all });
      qc.invalidateQueries({ queryKey: surgeryKeys.detail(id) });
    },
  });
}

export function useCancelSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => surgeryApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: surgeryKeys.all });
      qc.invalidateQueries({ queryKey: surgeryKeys.detail(id) });
    },
  });
}
