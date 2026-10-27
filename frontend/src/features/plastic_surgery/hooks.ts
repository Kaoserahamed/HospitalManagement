import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { plastic_surgeryApi } from './api';
import type { PlasticSurgeryCreateInput, PlasticSurgeryListParams, PlasticSurgeryUpdateInput } from './types';

export const plastic_surgeryKeys = {
  all: ['plastic_surgery'] as const,
  list: (params: PlasticSurgeryListParams) => ['plastic_surgery', 'list', params] as const,
  detail: (id: number) => ['plastic_surgery', 'detail', id] as const,
  summary: (patientId?: number) => ['plastic_surgery', 'summary', patientId] as const,
};

export function usePlasticSurgeryList(params: PlasticSurgeryListParams = {}) {
  return useQuery({
    queryKey: plastic_surgeryKeys.list(params),
    queryFn: () => plastic_surgeryApi.list(params),
  });
}

export function usePlasticSurgeryAll(patientId?: number) {
  return useQuery({
    queryKey: [...plastic_surgeryKeys.all, 'all', patientId],
    queryFn: () => plastic_surgeryApi.getAll(patientId),
  });
}

export function usePlasticSurgery(id: number) {
  return useQuery({
    queryKey: plastic_surgeryKeys.detail(id),
    queryFn: () => plastic_surgeryApi.get(id),
    enabled: !!id,
  });
}

export function usePlasticSurgeryCount() {
  return useQuery({
    queryKey: [...plastic_surgeryKeys.all, 'count'],
    queryFn: () => plastic_surgeryApi.count(),
  });
}

export function usePlasticSurgerySummary(patientId?: number) {
  return useQuery({
    queryKey: plastic_surgeryKeys.summary(patientId),
    queryFn: () => plastic_surgeryApi.summary(patientId),
  });
}

export function useCreatePlasticSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlasticSurgeryCreateInput) => plastic_surgeryApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: plastic_surgeryKeys.all }),
  });
}

export function useUpdatePlasticSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PlasticSurgeryUpdateInput }) => plastic_surgeryApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.detail(id) });
    },
  });
}

export function useDeletePlasticSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plastic_surgeryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: plastic_surgeryKeys.all }),
  });
}

export function useActivatePlasticSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plastic_surgeryApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.detail(id) });
    },
  });
}

export function useDeactivatePlasticSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plastic_surgeryApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.detail(id) });
    },
  });
}

export function useCompletePlasticSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => plastic_surgeryApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.detail(id) });
    },
  });
}

export function useCancelPlasticSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => plastic_surgeryApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.all });
      qc.invalidateQueries({ queryKey: plastic_surgeryKeys.detail(id) });
    },
  });
}
