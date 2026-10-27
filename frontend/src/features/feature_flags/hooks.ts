import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { featureFlagApi } from './api';

export function useFeatureFlags() {
  return useQuery({ queryKey: ['feature-flags'], queryFn: () => featureFlagApi.list() });
}

export function useCreateFeatureFlag() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => featureFlagApi.create(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['feature-flags'] }) });
}

export function useToggleFeatureFlag() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, enabled }: any) => featureFlagApi.toggle(id, enabled), onSuccess: () => qc.invalidateQueries({ queryKey: ['feature-flags'] }) });
}

export function useEvaluateFlag(key: string, user_id?: number, role?: string) {
  return useQuery({ queryKey: ['feature-flags', 'eval', key, user_id, role], queryFn: () => featureFlagApi.evaluate(key, user_id, role) });
}
