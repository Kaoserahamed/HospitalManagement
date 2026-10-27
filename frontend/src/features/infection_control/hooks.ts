import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { infection_controlApi } from './api';
import type { InfectionControlCreateInput, InfectionControlListParams, InfectionControlUpdateInput } from './types';

export const infection_controlKeys = {
  all: ['infection_control'] as const,
  list: (params: InfectionControlListParams) => ['infection_control', 'list', params] as const,
  detail: (id: number) => ['infection_control', 'detail', id] as const,
  summary: (patientId?: number) => ['infection_control', 'summary', patientId] as const,
};

export function useInfectionControlList(params: InfectionControlListParams = {}) {
  return useQuery({
    queryKey: infection_controlKeys.list(params),
    queryFn: () => infection_controlApi.list(params),
  });
}

export function useInfectionControlAll(patientId?: number) {
  return useQuery({
    queryKey: [...infection_controlKeys.all, 'all', patientId],
    queryFn: () => infection_controlApi.getAll(patientId),
  });
}

export function useInfectionControl(id: number) {
  return useQuery({
    queryKey: infection_controlKeys.detail(id),
    queryFn: () => infection_controlApi.get(id),
    enabled: !!id,
  });
}

export function useInfectionControlCount() {
  return useQuery({
    queryKey: [...infection_controlKeys.all, 'count'],
    queryFn: () => infection_controlApi.count(),
  });
}

export function useInfectionControlSummary(patientId?: number) {
  return useQuery({
    queryKey: infection_controlKeys.summary(patientId),
    queryFn: () => infection_controlApi.summary(patientId),
  });
}

export function useCreateInfectionControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InfectionControlCreateInput) => infection_controlApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: infection_controlKeys.all }),
  });
}

export function useUpdateInfectionControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: InfectionControlUpdateInput }) => infection_controlApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: infection_controlKeys.all });
      qc.invalidateQueries({ queryKey: infection_controlKeys.detail(id) });
    },
  });
}

export function useDeleteInfectionControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => infection_controlApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: infection_controlKeys.all }),
  });
}

export function useActivateInfectionControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => infection_controlApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: infection_controlKeys.all });
      qc.invalidateQueries({ queryKey: infection_controlKeys.detail(id) });
    },
  });
}

export function useDeactivateInfectionControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => infection_controlApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: infection_controlKeys.all });
      qc.invalidateQueries({ queryKey: infection_controlKeys.detail(id) });
    },
  });
}

export function useCompleteInfectionControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => infection_controlApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: infection_controlKeys.all });
      qc.invalidateQueries({ queryKey: infection_controlKeys.detail(id) });
    },
  });
}

export function useCancelInfectionControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => infection_controlApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: infection_controlKeys.all });
      qc.invalidateQueries({ queryKey: infection_controlKeys.detail(id) });
    },
  });
}
