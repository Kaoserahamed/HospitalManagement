import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { visitor_managementApi } from './api';
import type { VisitorManagementCreateInput, VisitorManagementListParams, VisitorManagementUpdateInput } from './types';

export const visitor_managementKeys = {
  all: ['visitor_management'] as const,
  list: (params: VisitorManagementListParams) => ['visitor_management', 'list', params] as const,
  detail: (id: number) => ['visitor_management', 'detail', id] as const,
  summary: (patientId?: number) => ['visitor_management', 'summary', patientId] as const,
};

export function useVisitorManagementList(params: VisitorManagementListParams = {}) {
  return useQuery({
    queryKey: visitor_managementKeys.list(params),
    queryFn: () => visitor_managementApi.list(params),
  });
}

export function useVisitorManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...visitor_managementKeys.all, 'all', patientId],
    queryFn: () => visitor_managementApi.getAll(patientId),
  });
}

export function useVisitorManagement(id: number) {
  return useQuery({
    queryKey: visitor_managementKeys.detail(id),
    queryFn: () => visitor_managementApi.get(id),
    enabled: !!id,
  });
}

export function useVisitorManagementCount() {
  return useQuery({
    queryKey: [...visitor_managementKeys.all, 'count'],
    queryFn: () => visitor_managementApi.count(),
  });
}

export function useVisitorManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: visitor_managementKeys.summary(patientId),
    queryFn: () => visitor_managementApi.summary(patientId),
  });
}

export function useCreateVisitorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: VisitorManagementCreateInput) => visitor_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: visitor_managementKeys.all }),
  });
}

export function useUpdateVisitorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: VisitorManagementUpdateInput }) => visitor_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: visitor_managementKeys.all });
      qc.invalidateQueries({ queryKey: visitor_managementKeys.detail(id) });
    },
  });
}

export function useDeleteVisitorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => visitor_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: visitor_managementKeys.all }),
  });
}

export function useActivateVisitorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => visitor_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: visitor_managementKeys.all });
      qc.invalidateQueries({ queryKey: visitor_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateVisitorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => visitor_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: visitor_managementKeys.all });
      qc.invalidateQueries({ queryKey: visitor_managementKeys.detail(id) });
    },
  });
}

export function useCompleteVisitorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => visitor_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: visitor_managementKeys.all });
      qc.invalidateQueries({ queryKey: visitor_managementKeys.detail(id) });
    },
  });
}

export function useCancelVisitorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => visitor_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: visitor_managementKeys.all });
      qc.invalidateQueries({ queryKey: visitor_managementKeys.detail(id) });
    },
  });
}
