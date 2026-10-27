import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { performanceApi } from './api';

export function usePerformanceSummary(endpoint?: string) {
  return useQuery({ queryKey: ['performance', 'summary', endpoint], queryFn: () => performanceApi.summary(endpoint) });
}

export function useSlowestEndpoints(limit = 5) {
  return useQuery({ queryKey: ['performance', 'slowest', limit], queryFn: () => performanceApi.slowestEndpoints(limit) });
}

export function useTopSlowQueries(limit = 10) {
  return useQuery({ queryKey: ['performance', 'slow-queries', limit], queryFn: () => performanceApi.topSlowQueries(limit) });
}

export function useRecordMetric() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => performanceApi.recordMetric(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['performance'] }) });
}
