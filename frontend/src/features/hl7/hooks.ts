import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hl7Api } from './api';

export function useHL7Messages(params: any = {}) {
  return useQuery({ queryKey: ['hl7', 'messages', params], queryFn: () => hl7Api.list(params) });
}

export function useHL7Count() {
  return useQuery({ queryKey: ['hl7', 'count'], queryFn: () => hl7Api.count() });
}

export function useReceiveHL7() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => hl7Api.receive(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['hl7'] }) });
}

export function useProcessHL7() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => hl7Api.process(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['hl7'] }) });
}
