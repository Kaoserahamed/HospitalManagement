import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { codingApi } from './api';

export function useCommonIcd10() {
  return useQuery({ queryKey: ['coding', 'icd10'], queryFn: () => codingApi.commonIcd10() });
}

export function useCommonCpt() {
  return useQuery({ queryKey: ['coding', 'cpt'], queryFn: () => codingApi.commonCpt() });
}

export function useValidateCode() {
  return useMutation({ mutationFn: ({ system, code }: any) => codingApi.validate(system, code) });
}

export function useSearchCodes() {
  return useMutation({ mutationFn: (p: any) => codingApi.search(p) });
}

export function useAddEncounterCode() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => codingApi.addEncounterCode(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['coding'] }) });
}
