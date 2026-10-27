import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pharmacyApi } from './api';
import type { MedicationCreateInput, MedicationListParams } from './types';

export const pharmacyKeys = { all: ['pharmacy'] as const, medications: (p: MedicationListParams) => ['pharmacy', 'medications', p] as const, lowStock: ['pharmacy', 'lowStock'] as const };

export function useMedications(params: MedicationListParams = {}) {
  return useQuery({ queryKey: pharmacyKeys.medications(params), queryFn: () => pharmacyApi.listMedications(params) });
}

export function useCreateMedication() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: MedicationCreateInput) => pharmacyApi.createMedication(p), onSuccess: () => qc.invalidateQueries({ queryKey: pharmacyKeys.all }) });
}

export function useLowStock() {
  return useQuery({ queryKey: pharmacyKeys.lowStock, queryFn: () => pharmacyApi.lowStock() });
}

export function useDispense() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => pharmacyApi.dispense(p), onSuccess: () => qc.invalidateQueries({ queryKey: pharmacyKeys.all }) });
}

export function useCheckInteraction() {
  return useMutation({ mutationFn: (p: any) => pharmacyApi.checkInteraction(p) });
}
