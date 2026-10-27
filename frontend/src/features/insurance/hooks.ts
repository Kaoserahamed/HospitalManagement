import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { insuranceApi } from './api';

export function useInsurancePlans() {
  return useQuery({ queryKey: ['insurance', 'plans'], queryFn: () => insuranceApi.listPlans() });
}

export function useClaims(params: any = {}) {
  return useQuery({ queryKey: ['insurance', 'claims', params], queryFn: () => insuranceApi.listClaims(params) });
}

export function useSubmitClaim() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => insuranceApi.submitClaim(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['insurance'] }) });
}

export function useApproveClaim() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, amount }: any) => insuranceApi.approveClaim(id, amount), onSuccess: () => qc.invalidateQueries({ queryKey: ['insurance'] }) });
}
