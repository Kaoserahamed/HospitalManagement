import { useQuery } from '@tanstack/react-query';
import { auditApi } from './api';

export function useAuditLogs(params: any = {}) {
  return useQuery({ queryKey: ['audit', 'logs', params], queryFn: () => auditApi.list(params) });
}

export function useRecentAuditLogs(limit = 20) {
  return useQuery({ queryKey: ['audit', 'recent', limit], queryFn: () => auditApi.recent(limit) });
}

export function useAuditCount() {
  return useQuery({ queryKey: ['audit', 'count'], queryFn: () => auditApi.count() });
}
