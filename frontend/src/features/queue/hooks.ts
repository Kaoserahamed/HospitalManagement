import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queueApi } from './api';

export function useTasks(params: any = {}) {
  return useQuery({ queryKey: ['queue', 'tasks', params], queryFn: () => queueApi.list(params) });
}

export function useQueueStats() {
  return useQuery({ queryKey: ['queue', 'stats'], queryFn: () => queueApi.stats() });
}

export function useEnqueueTask() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => queueApi.enqueue(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['queue'] }) });
}

export function useDequeueTask() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => queueApi.dequeue(), onSuccess: () => qc.invalidateQueries({ queryKey: ['queue'] }) });
}
