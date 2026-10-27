import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stroke_protocolApi } from './api';
import type { StrokeProtocolCreateInput, StrokeProtocolListParams, StrokeProtocolUpdateInput } from './types';

export const stroke_protocolKeys = {
  all: ['stroke_protocol'] as const,
  list: (params: StrokeProtocolListParams) => ['stroke_protocol', 'list', params] as const,
  detail: (id: number) => ['stroke_protocol', 'detail', id] as const,
  summary: (patientId?: number) => ['stroke_protocol', 'summary', patientId] as const,
};

export function useStrokeProtocolList(params: StrokeProtocolListParams = {}) {
  return useQuery({
    queryKey: stroke_protocolKeys.list(params),
    queryFn: () => stroke_protocolApi.list(params),
  });
}

export function useStrokeProtocolAll(patientId?: number) {
  return useQuery({
    queryKey: [...stroke_protocolKeys.all, 'all', patientId],
    queryFn: () => stroke_protocolApi.getAll(patientId),
  });
}

export function useStrokeProtocol(id: number) {
  return useQuery({
    queryKey: stroke_protocolKeys.detail(id),
    queryFn: () => stroke_protocolApi.get(id),
    enabled: !!id,
  });
}

export function useStrokeProtocolCount() {
  return useQuery({
    queryKey: [...stroke_protocolKeys.all, 'count'],
    queryFn: () => stroke_protocolApi.count(),
  });
}

export function useStrokeProtocolSummary(patientId?: number) {
  return useQuery({
    queryKey: stroke_protocolKeys.summary(patientId),
    queryFn: () => stroke_protocolApi.summary(patientId),
  });
}

export function useCreateStrokeProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: StrokeProtocolCreateInput) => stroke_protocolApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: stroke_protocolKeys.all }),
  });
}

export function useUpdateStrokeProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: StrokeProtocolUpdateInput }) => stroke_protocolApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.all });
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.detail(id) });
    },
  });
}

export function useDeleteStrokeProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => stroke_protocolApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: stroke_protocolKeys.all }),
  });
}

export function useActivateStrokeProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => stroke_protocolApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.all });
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.detail(id) });
    },
  });
}

export function useDeactivateStrokeProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => stroke_protocolApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.all });
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.detail(id) });
    },
  });
}

export function useCompleteStrokeProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => stroke_protocolApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.all });
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.detail(id) });
    },
  });
}

export function useCancelStrokeProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => stroke_protocolApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.all });
      qc.invalidateQueries({ queryKey: stroke_protocolKeys.detail(id) });
    },
  });
}
