import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { security_incidentApi } from './api';
import type { SecurityIncidentCreateInput, SecurityIncidentListParams, SecurityIncidentUpdateInput } from './types';

export const security_incidentKeys = {
  all: ['security_incident'] as const,
  list: (params: SecurityIncidentListParams) => ['security_incident', 'list', params] as const,
  detail: (id: number) => ['security_incident', 'detail', id] as const,
  summary: (patientId?: number) => ['security_incident', 'summary', patientId] as const,
};

export function useSecurityIncidentList(params: SecurityIncidentListParams = {}) {
  return useQuery({
    queryKey: security_incidentKeys.list(params),
    queryFn: () => security_incidentApi.list(params),
  });
}

export function useSecurityIncidentAll(patientId?: number) {
  return useQuery({
    queryKey: [...security_incidentKeys.all, 'all', patientId],
    queryFn: () => security_incidentApi.getAll(patientId),
  });
}

export function useSecurityIncident(id: number) {
  return useQuery({
    queryKey: security_incidentKeys.detail(id),
    queryFn: () => security_incidentApi.get(id),
    enabled: !!id,
  });
}

export function useSecurityIncidentCount() {
  return useQuery({
    queryKey: [...security_incidentKeys.all, 'count'],
    queryFn: () => security_incidentApi.count(),
  });
}

export function useSecurityIncidentSummary(patientId?: number) {
  return useQuery({
    queryKey: security_incidentKeys.summary(patientId),
    queryFn: () => security_incidentApi.summary(patientId),
  });
}

export function useCreateSecurityIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SecurityIncidentCreateInput) => security_incidentApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: security_incidentKeys.all }),
  });
}

export function useUpdateSecurityIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SecurityIncidentUpdateInput }) => security_incidentApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: security_incidentKeys.all });
      qc.invalidateQueries({ queryKey: security_incidentKeys.detail(id) });
    },
  });
}

export function useDeleteSecurityIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => security_incidentApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: security_incidentKeys.all }),
  });
}

export function useActivateSecurityIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => security_incidentApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: security_incidentKeys.all });
      qc.invalidateQueries({ queryKey: security_incidentKeys.detail(id) });
    },
  });
}

export function useDeactivateSecurityIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => security_incidentApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: security_incidentKeys.all });
      qc.invalidateQueries({ queryKey: security_incidentKeys.detail(id) });
    },
  });
}

export function useCompleteSecurityIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => security_incidentApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: security_incidentKeys.all });
      qc.invalidateQueries({ queryKey: security_incidentKeys.detail(id) });
    },
  });
}

export function useCancelSecurityIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => security_incidentApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: security_incidentKeys.all });
      qc.invalidateQueries({ queryKey: security_incidentKeys.detail(id) });
    },
  });
}
