import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { facility_managementApi } from './api';
import type { FacilityManagementCreateInput, FacilityManagementListParams, FacilityManagementUpdateInput } from './types';

export const facility_managementKeys = {
  all: ['facility_management'] as const,
  list: (params: FacilityManagementListParams) => ['facility_management', 'list', params] as const,
  detail: (id: number) => ['facility_management', 'detail', id] as const,
  summary: (patientId?: number) => ['facility_management', 'summary', patientId] as const,
};

export function useFacilityManagementList(params: FacilityManagementListParams = {}) {
  return useQuery({
    queryKey: facility_managementKeys.list(params),
    queryFn: () => facility_managementApi.list(params),
  });
}

export function useFacilityManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...facility_managementKeys.all, 'all', patientId],
    queryFn: () => facility_managementApi.getAll(patientId),
  });
}

export function useFacilityManagement(id: number) {
  return useQuery({
    queryKey: facility_managementKeys.detail(id),
    queryFn: () => facility_managementApi.get(id),
    enabled: !!id,
  });
}

export function useFacilityManagementCount() {
  return useQuery({
    queryKey: [...facility_managementKeys.all, 'count'],
    queryFn: () => facility_managementApi.count(),
  });
}

export function useFacilityManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: facility_managementKeys.summary(patientId),
    queryFn: () => facility_managementApi.summary(patientId),
  });
}

export function useCreateFacilityManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FacilityManagementCreateInput) => facility_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: facility_managementKeys.all }),
  });
}

export function useUpdateFacilityManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FacilityManagementUpdateInput }) => facility_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: facility_managementKeys.all });
      qc.invalidateQueries({ queryKey: facility_managementKeys.detail(id) });
    },
  });
}

export function useDeleteFacilityManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => facility_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: facility_managementKeys.all }),
  });
}

export function useActivateFacilityManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => facility_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: facility_managementKeys.all });
      qc.invalidateQueries({ queryKey: facility_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateFacilityManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => facility_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: facility_managementKeys.all });
      qc.invalidateQueries({ queryKey: facility_managementKeys.detail(id) });
    },
  });
}

export function useCompleteFacilityManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => facility_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: facility_managementKeys.all });
      qc.invalidateQueries({ queryKey: facility_managementKeys.detail(id) });
    },
  });
}

export function useCancelFacilityManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => facility_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: facility_managementKeys.all });
      qc.invalidateQueries({ queryKey: facility_managementKeys.detail(id) });
    },
  });
}
