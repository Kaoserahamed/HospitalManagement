import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { securityApi } from './api';

export function useSecurityEvents(params: any = {}) {
  return useQuery({ queryKey: ['security', 'events', params], queryFn: () => securityApi.listEvents(params) });
}

export function useSecuritySummary() {
  return useQuery({ queryKey: ['security', 'summary'], queryFn: () => securityApi.summary() });
}

export function useSetupMfa() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ user_id, method }: any) => securityApi.setupMfa(user_id, method), onSuccess: () => qc.invalidateQueries({ queryKey: ['security'] }) });
}

export function useVerifyMfa() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => securityApi.verifyMfa(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['security'] }) });
}

export function useRecordSecurityEvent() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => securityApi.recordEvent(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['security'] }) });
}
