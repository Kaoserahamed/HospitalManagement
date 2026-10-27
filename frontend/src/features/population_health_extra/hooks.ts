import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { population_health_extraApi } from './api';
import type { PopulationHealthExtraCreateInput, PopulationHealthExtraListParams, PopulationHealthExtraUpdateInput } from './types';

export const population_health_extraKeys = {
  all: ['population_health_extra'] as const,
  list: (params: PopulationHealthExtraListParams) => ['population_health_extra', 'list', params] as const,
  detail: (id: number) => ['population_health_extra', 'detail', id] as const,
  summary: (patientId?: number) => ['population_health_extra', 'summary', patientId] as const,
};

export function usePopulationHealthExtraList(params: PopulationHealthExtraListParams = {}) {
  return useQuery({
    queryKey: population_health_extraKeys.list(params),
    queryFn: () => population_health_extraApi.list(params),
  });
}

export function usePopulationHealthExtraAll(patientId?: number) {
  return useQuery({
    queryKey: [...population_health_extraKeys.all, 'all', patientId],
    queryFn: () => population_health_extraApi.getAll(patientId),
  });
}

export function usePopulationHealthExtra(id: number) {
  return useQuery({
    queryKey: population_health_extraKeys.detail(id),
    queryFn: () => population_health_extraApi.get(id),
    enabled: !!id,
  });
}

export function usePopulationHealthExtraCount() {
  return useQuery({
    queryKey: [...population_health_extraKeys.all, 'count'],
    queryFn: () => population_health_extraApi.count(),
  });
}

export function usePopulationHealthExtraSummary(patientId?: number) {
  return useQuery({
    queryKey: population_health_extraKeys.summary(patientId),
    queryFn: () => population_health_extraApi.summary(patientId),
  });
}

export function useCreatePopulationHealthExtra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PopulationHealthExtraCreateInput) => population_health_extraApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: population_health_extraKeys.all }),
  });
}

export function useUpdatePopulationHealthExtra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PopulationHealthExtraUpdateInput }) => population_health_extraApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: population_health_extraKeys.all });
      qc.invalidateQueries({ queryKey: population_health_extraKeys.detail(id) });
    },
  });
}

export function useDeletePopulationHealthExtra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => population_health_extraApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: population_health_extraKeys.all }),
  });
}

export function useActivatePopulationHealthExtra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => population_health_extraApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: population_health_extraKeys.all });
      qc.invalidateQueries({ queryKey: population_health_extraKeys.detail(id) });
    },
  });
}

export function useDeactivatePopulationHealthExtra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => population_health_extraApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: population_health_extraKeys.all });
      qc.invalidateQueries({ queryKey: population_health_extraKeys.detail(id) });
    },
  });
}

export function useCompletePopulationHealthExtra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => population_health_extraApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: population_health_extraKeys.all });
      qc.invalidateQueries({ queryKey: population_health_extraKeys.detail(id) });
    },
  });
}

export function useCancelPopulationHealthExtra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => population_health_extraApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: population_health_extraKeys.all });
      qc.invalidateQueries({ queryKey: population_health_extraKeys.detail(id) });
    },
  });
}
