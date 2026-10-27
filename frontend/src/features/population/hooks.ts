import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { populationApi } from './api';

export function useRegistries() {
  return useQuery({ queryKey: ['population', 'registries'], queryFn: () => populationApi.listRegistries() });
}

export function useRegistry(id: number) {
  return useQuery({ queryKey: ['population', 'registry', id], queryFn: () => populationApi.getRegistry(id), enabled: !!id });
}

export function useCreateRegistry() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => populationApi.createRegistry(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['population'] }) });
}

export function useRegistrySummary(id: number) {
  return useQuery({ queryKey: ['population', 'summary', id], queryFn: () => populationApi.registrySummary(id), enabled: !!id });
}
