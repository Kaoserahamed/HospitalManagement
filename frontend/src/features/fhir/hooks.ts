import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fhirApi } from './api';

export function useFHIRCount() {
  return useQuery({ queryKey: ['fhir', 'count'], queryFn: () => fhirApi.count() });
}

export function useFHIRSubscriptions(resource_type?: string) {
  return useQuery({ queryKey: ['fhir', 'subscriptions', resource_type], queryFn: () => fhirApi.listSubscriptions(resource_type) });
}

export function useCreateFHIRResource() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => fhirApi.createResource(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['fhir'] }) });
}

export function useCreateFHIRSubscription() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => fhirApi.createSubscription(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['fhir'] }) });
}
