import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { infectious_diseaseApi } from './api';
import type { InfectiousDiseaseCreateInput, InfectiousDiseaseListParams, InfectiousDiseaseUpdateInput } from './types';

export const infectious_diseaseKeys = {
  all: ['infectious_disease'] as const,
  list: (params: InfectiousDiseaseListParams) => ['infectious_disease', 'list', params] as const,
  detail: (id: number) => ['infectious_disease', 'detail', id] as const,
  summary: (patientId?: number) => ['infectious_disease', 'summary', patientId] as const,
};

export function useInfectiousDiseaseList(params: InfectiousDiseaseListParams = {}) {
  return useQuery({
    queryKey: infectious_diseaseKeys.list(params),
    queryFn: () => infectious_diseaseApi.list(params),
  });
}

export function useInfectiousDiseaseAll(patientId?: number) {
  return useQuery({
    queryKey: [...infectious_diseaseKeys.all, 'all', patientId],
    queryFn: () => infectious_diseaseApi.getAll(patientId),
  });
}

export function useInfectiousDisease(id: number) {
  return useQuery({
    queryKey: infectious_diseaseKeys.detail(id),
    queryFn: () => infectious_diseaseApi.get(id),
    enabled: !!id,
  });
}

export function useInfectiousDiseaseCount() {
  return useQuery({
    queryKey: [...infectious_diseaseKeys.all, 'count'],
    queryFn: () => infectious_diseaseApi.count(),
  });
}

export function useInfectiousDiseaseSummary(patientId?: number) {
  return useQuery({
    queryKey: infectious_diseaseKeys.summary(patientId),
    queryFn: () => infectious_diseaseApi.summary(patientId),
  });
}

export function useCreateInfectiousDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InfectiousDiseaseCreateInput) => infectious_diseaseApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: infectious_diseaseKeys.all }),
  });
}

export function useUpdateInfectiousDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: InfectiousDiseaseUpdateInput }) => infectious_diseaseApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.all });
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.detail(id) });
    },
  });
}

export function useDeleteInfectiousDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => infectious_diseaseApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: infectious_diseaseKeys.all }),
  });
}

export function useActivateInfectiousDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => infectious_diseaseApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.all });
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.detail(id) });
    },
  });
}

export function useDeactivateInfectiousDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => infectious_diseaseApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.all });
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.detail(id) });
    },
  });
}

export function useCompleteInfectiousDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => infectious_diseaseApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.all });
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.detail(id) });
    },
  });
}

export function useCancelInfectiousDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => infectious_diseaseApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.all });
      qc.invalidateQueries({ queryKey: infectious_diseaseKeys.detail(id) });
    },
  });
}
