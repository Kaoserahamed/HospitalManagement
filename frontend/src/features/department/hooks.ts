import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from './api';

export function useDepartments(params: any = {}) {
  return useQuery({ queryKey: ['departments', params], queryFn: () => departmentApi.list(params) });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => departmentApi.create(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }) });
}

export function useDepartmentRooms(department_id: number) {
  return useQuery({ queryKey: ['departments', 'rooms', department_id], queryFn: () => departmentApi.listRooms(department_id), enabled: !!department_id });
}
