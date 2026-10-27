import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supply_chainApi } from './api';
import type { SupplyChainCreateInput, SupplyChainListParams, SupplyChainUpdateInput } from './types';

export const supply_chainKeys = {
  all: ['supply_chain'] as const,
  list: (params: SupplyChainListParams) => ['supply_chain', 'list', params] as const,
  detail: (id: number) => ['supply_chain', 'detail', id] as const,
  summary: (patientId?: number) => ['supply_chain', 'summary', patientId] as const,
};

export function useSupplyChainList(params: SupplyChainListParams = {}) {
  return useQuery({
    queryKey: supply_chainKeys.list(params),
    queryFn: () => supply_chainApi.list(params),
  });
}

export function useSupplyChainAll(patientId?: number) {
  return useQuery({
    queryKey: [...supply_chainKeys.all, 'all', patientId],
    queryFn: () => supply_chainApi.getAll(patientId),
  });
}

export function useSupplyChain(id: number) {
  return useQuery({
    queryKey: supply_chainKeys.detail(id),
    queryFn: () => supply_chainApi.get(id),
    enabled: !!id,
  });
}

export function useSupplyChainCount() {
  return useQuery({
    queryKey: [...supply_chainKeys.all, 'count'],
    queryFn: () => supply_chainApi.count(),
  });
}

export function useSupplyChainSummary(patientId?: number) {
  return useQuery({
    queryKey: supply_chainKeys.summary(patientId),
    queryFn: () => supply_chainApi.summary(patientId),
  });
}

export function useCreateSupplyChain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupplyChainCreateInput) => supply_chainApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: supply_chainKeys.all }),
  });
}

export function useUpdateSupplyChain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SupplyChainUpdateInput }) => supply_chainApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: supply_chainKeys.all });
      qc.invalidateQueries({ queryKey: supply_chainKeys.detail(id) });
    },
  });
}

export function useDeleteSupplyChain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => supply_chainApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: supply_chainKeys.all }),
  });
}

export function useActivateSupplyChain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => supply_chainApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: supply_chainKeys.all });
      qc.invalidateQueries({ queryKey: supply_chainKeys.detail(id) });
    },
  });
}

export function useDeactivateSupplyChain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => supply_chainApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: supply_chainKeys.all });
      qc.invalidateQueries({ queryKey: supply_chainKeys.detail(id) });
    },
  });
}

export function useCompleteSupplyChain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => supply_chainApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: supply_chainKeys.all });
      qc.invalidateQueries({ queryKey: supply_chainKeys.detail(id) });
    },
  });
}

export function useCancelSupplyChain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => supply_chainApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: supply_chainKeys.all });
      qc.invalidateQueries({ queryKey: supply_chainKeys.detail(id) });
    },
  });
}
