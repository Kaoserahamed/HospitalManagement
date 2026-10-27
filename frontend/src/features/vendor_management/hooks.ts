import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vendor_managementApi } from './api';
import type { VendorManagementCreateInput, VendorManagementListParams, VendorManagementUpdateInput } from './types';

export const vendor_managementKeys = {
  all: ['vendor_management'] as const,
  list: (params: VendorManagementListParams) => ['vendor_management', 'list', params] as const,
  detail: (id: number) => ['vendor_management', 'detail', id] as const,
  summary: (patientId?: number) => ['vendor_management', 'summary', patientId] as const,
};

export function useVendorManagementList(params: VendorManagementListParams = {}) {
  return useQuery({
    queryKey: vendor_managementKeys.list(params),
    queryFn: () => vendor_managementApi.list(params),
  });
}

export function useVendorManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...vendor_managementKeys.all, 'all', patientId],
    queryFn: () => vendor_managementApi.getAll(patientId),
  });
}

export function useVendorManagement(id: number) {
  return useQuery({
    queryKey: vendor_managementKeys.detail(id),
    queryFn: () => vendor_managementApi.get(id),
    enabled: !!id,
  });
}

export function useVendorManagementCount() {
  return useQuery({
    queryKey: [...vendor_managementKeys.all, 'count'],
    queryFn: () => vendor_managementApi.count(),
  });
}

export function useVendorManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: vendor_managementKeys.summary(patientId),
    queryFn: () => vendor_managementApi.summary(patientId),
  });
}

export function useCreateVendorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: VendorManagementCreateInput) => vendor_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: vendor_managementKeys.all }),
  });
}

export function useUpdateVendorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: VendorManagementUpdateInput }) => vendor_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: vendor_managementKeys.all });
      qc.invalidateQueries({ queryKey: vendor_managementKeys.detail(id) });
    },
  });
}

export function useDeleteVendorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendor_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: vendor_managementKeys.all }),
  });
}

export function useActivateVendorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendor_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: vendor_managementKeys.all });
      qc.invalidateQueries({ queryKey: vendor_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateVendorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendor_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: vendor_managementKeys.all });
      qc.invalidateQueries({ queryKey: vendor_managementKeys.detail(id) });
    },
  });
}

export function useCompleteVendorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => vendor_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: vendor_managementKeys.all });
      qc.invalidateQueries({ queryKey: vendor_managementKeys.detail(id) });
    },
  });
}

export function useCancelVendorManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => vendor_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: vendor_managementKeys.all });
      qc.invalidateQueries({ queryKey: vendor_managementKeys.detail(id) });
    },
  });
}
