import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cacheApi } from './api';

export function useCacheStats() {
  return useQuery({ queryKey: ['cache', 'stats'], queryFn: () => cacheApi.stats() });
}

export function useCacheKeys() {
  return useQuery({ queryKey: ['cache', 'keys'], queryFn: () => cacheApi.keys() });
}

export function useSetCache() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ key, value, ttl }: any) => cacheApi.set(key, value, ttl), onSuccess: () => qc.invalidateQueries({ queryKey: ['cache'] }) });
}

export function useDeleteCache() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (key: string) => cacheApi.delete(key), onSuccess: () => qc.invalidateQueries({ queryKey: ['cache'] }) });
}
