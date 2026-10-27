import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rulesEngineApi } from './api';

export function useRules(rule_type?: string, status?: string) {
  return useQuery({ queryKey: ['rules', rule_type, status], queryFn: () => rulesEngineApi.listRules(rule_type, status) });
}

export function useActiveRules() {
  return useQuery({ queryKey: ['rules', 'active'], queryFn: () => rulesEngineApi.activeRules() });
}

export function useCreateRule() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => rulesEngineApi.createRule(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }) });
}

export function useEvaluateRule() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => rulesEngineApi.evaluate(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }) });
}

export function useRuleSets() {
  return useQuery({ queryKey: ['rules', 'sets'], queryFn: () => rulesEngineApi.listSets() });
}

export function useCreateRuleSet() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => rulesEngineApi.createSet(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }) });
}
