import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { integrationApi } from './api';

export function useAdapters(adapter_type?: string, status?: string) {
  return useQuery({ queryKey: ['integration', 'adapters', adapter_type, status], queryFn: () => integrationApi.listAdapters(adapter_type, status) });
}

export function useCreateAdapter() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => integrationApi.createAdapter(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['integration'] }) });
}

export function useSyncAdapter() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => integrationApi.sync(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['integration'] }) });
}

export function useWebhooks(is_active?: boolean) {
  return useQuery({ queryKey: ['integration', 'webhooks', is_active], queryFn: () => integrationApi.listWebhooks(is_active) });
}

export function useCreateWebhook() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => integrationApi.createWebhook(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['integration'] }) });
}
