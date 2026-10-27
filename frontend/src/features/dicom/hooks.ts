import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dicomApi } from './api';

export function useStudies(patient_id?: number) {
  return useQuery({ queryKey: ['dicom', 'studies', patient_id], queryFn: () => dicomApi.listStudies(patient_id) });
}

export function useStudy(id: number) {
  return useQuery({ queryKey: ['dicom', 'study', id], queryFn: () => dicomApi.getStudy(id), enabled: !!id });
}

export function useCreateStudy() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => dicomApi.createStudy(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['dicom'] }) });
}

export function useStudySummary(id: number) {
  return useQuery({ queryKey: ['dicom', 'summary', id], queryFn: () => dicomApi.studySummary(id), enabled: !!id });
}
