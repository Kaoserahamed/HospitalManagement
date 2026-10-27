import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from './api';

export function useDashboard() {
  return useQuery({ queryKey: ['analytics', 'dashboard'], queryFn: () => analyticsApi.dashboard() });
}

export function useQualityMeasures() {
  return useQuery({ queryKey: ['analytics', 'measures'], queryFn: () => analyticsApi.listMeasures() });
}

export function useCreateMeasure() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => analyticsApi.createMeasure(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['analytics'] }) });
}

export function useReports() {
  return useQuery({ queryKey: ['analytics', 'reports'], queryFn: () => analyticsApi.listReports() });
}

export function useCreateReport() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => analyticsApi.createReport(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['analytics'] }) });
}

export function useReadmissionRisks(patient_id?: number, risk_level?: string) {
  return useQuery({ queryKey: ['analytics', 'risks', patient_id, risk_level], queryFn: () => analyticsApi.listRisks(patient_id, risk_level) });
}
