import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { advance_directiveApi } from './api';
import type { AdvanceDirectiveCreateInput, AdvanceDirectiveListParams, AdvanceDirectiveUpdateInput } from './types';

export const advance_directiveKeys = {
  all: ['advance_directive'] as const,
  list: (params: AdvanceDirectiveListParams) => ['advance_directive', 'list', params] as const,
  detail: (id: number) => ['advance_directive', 'detail', id] as const,
  summary: (patientId?: number) => ['advance_directive', 'summary', patientId] as const,
};

export function useAdvanceDirectiveList(params: AdvanceDirectiveListParams = {}) {
  return useQuery({
    queryKey: advance_directiveKeys.list(params),
    queryFn: () => advance_directiveApi.list(params),
  });
}

export function useAdvanceDirectiveAll(patientId?: number) {
  return useQuery({
    queryKey: [...advance_directiveKeys.all, 'all', patientId],
    queryFn: () => advance_directiveApi.getAll(patientId),
  });
}

export function useAdvanceDirective(id: number) {
  return useQuery({
    queryKey: advance_directiveKeys.detail(id),
    queryFn: () => advance_directiveApi.get(id),
    enabled: !!id,
  });
}

export function useAdvanceDirectiveCount() {
  return useQuery({
    queryKey: [...advance_directiveKeys.all, 'count'],
    queryFn: () => advance_directiveApi.count(),
  });
}

export function useAdvanceDirectiveSummary(patientId?: number) {
  return useQuery({
    queryKey: advance_directiveKeys.summary(patientId),
    queryFn: () => advance_directiveApi.summary(patientId),
  });
}

export function useCreateAdvanceDirective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdvanceDirectiveCreateInput) => advance_directiveApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: advance_directiveKeys.all }),
  });
}

export function useUpdateAdvanceDirective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdvanceDirectiveUpdateInput }) => advance_directiveApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: advance_directiveKeys.all });
      qc.invalidateQueries({ queryKey: advance_directiveKeys.detail(id) });
    },
  });
}

export function useDeleteAdvanceDirective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => advance_directiveApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: advance_directiveKeys.all }),
  });
}

export function useActivateAdvanceDirective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => advance_directiveApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: advance_directiveKeys.all });
      qc.invalidateQueries({ queryKey: advance_directiveKeys.detail(id) });
    },
  });
}

export function useDeactivateAdvanceDirective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => advance_directiveApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: advance_directiveKeys.all });
      qc.invalidateQueries({ queryKey: advance_directiveKeys.detail(id) });
    },
  });
}

export function useCompleteAdvanceDirective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => advance_directiveApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: advance_directiveKeys.all });
      qc.invalidateQueries({ queryKey: advance_directiveKeys.detail(id) });
    },
  });
}

export function useCancelAdvanceDirective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => advance_directiveApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: advance_directiveKeys.all });
      qc.invalidateQueries({ queryKey: advance_directiveKeys.detail(id) });
    },
  });
}
