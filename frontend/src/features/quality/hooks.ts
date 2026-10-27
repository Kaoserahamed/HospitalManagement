import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qualityApi } from './api';

export function useQualityMeasures(category?: string) {
  return useQuery({ queryKey: ['quality', 'measures', category], queryFn: () => qualityApi.listMeasures(category) });
}

export function useQualitySummary(id: number) {
  return useQuery({ queryKey: ['quality', 'summary', id], queryFn: () => qualityApi.getSummary(id), enabled: !!id });
}

export function useAllQualitySummaries() {
  return useQuery({ queryKey: ['quality', 'summaries'], queryFn: () => qualityApi.allSummaries() });
}

export function useCreateQualityMeasure() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => qualityApi.createMeasure(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['quality'] }) });
}

export function useRecordQualityResult() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => qualityApi.recordResult(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['quality'] }) });
}
