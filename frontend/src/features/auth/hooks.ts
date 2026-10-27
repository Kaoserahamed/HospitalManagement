import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from './api';

export function useLogin() {
  return useMutation({ mutationFn: (p: { email: string; password: string }) => authApi.login(p) });
}

export function useRegisterPatient() {
  return useMutation({ mutationFn: (p: any) => authApi.registerPatient(p) });
}

export function useCreateUser() {
  return useMutation({ mutationFn: (p: any) => authApi.createUser(p) });
}

export function useMe() {
  return useQuery({ queryKey: ['auth', 'me'], queryFn: () => authApi.me() });
}
