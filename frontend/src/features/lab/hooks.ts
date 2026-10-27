import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { labApi } from './api';

export function useLabOrders(params: any = {}) {
  return useQuery({ queryKey: ['lab', 'orders', params], queryFn: () => labApi.listOrders(params) });
}

export function useLabOrder(id: number) {
  return useQuery({ queryKey: ['lab', 'order', id], queryFn: () => labApi.getOrder(id), enabled: !!id });
}

export function useCreateLabOrder() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => labApi.createOrder(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['lab'] }) });
}

export function useCollectSample() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => labApi.collectSample(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['lab'] }) });
}

export function useAddLabResult() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => labApi.addResult(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['lab'] }) });
}

export function useLabPanels() {
  return useQuery({ queryKey: ['lab', 'panels'], queryFn: () => labApi.listPanels() });
}
