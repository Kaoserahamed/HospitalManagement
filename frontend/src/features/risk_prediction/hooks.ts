import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { riskPredictionApi } from './api';

export function useRiskModels() {
  return useQuery({ queryKey: ['risk', 'models'], queryFn: () => riskPredictionApi.listModels() });
}

export function useActiveRiskModel() {
  return useQuery({ queryKey: ['risk', 'active-model'], queryFn: () => riskPredictionApi.activeModel() });
}

export function useRiskFactors() {
  return useQuery({ queryKey: ['risk', 'factors'], queryFn: () => riskPredictionApi.listFactors() });
}

export function useFeatureImportance() {
  return useQuery({ queryKey: ['risk', 'importance'], queryFn: () => riskPredictionApi.featureImportance() });
}

export function useEvaluateRisk() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => riskPredictionApi.evaluate(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['risk'] }) });
}

export function usePredictReadmission() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ patient_id, encounter_id }: any) => riskPredictionApi.predictReadmission(patient_id, encounter_id), onSuccess: () => qc.invalidateQueries({ queryKey: ['risk'] }) });
}

export function useHighRiskPatients(threshold = 0.7) {
  return useQuery({ queryKey: ['risk', 'high-risk', threshold], queryFn: () => riskPredictionApi.highRiskPatients(threshold) });
}
