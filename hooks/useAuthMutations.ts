import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@/hooks/useMutation';
import { CreateUserPayload, LoginPayload } from '@/types/user';

export function useLoginMutation() {
  const router = useRouter();
  const { login } = useAuth();

  const loginFn = useCallback(
    async (payload: LoginPayload) => {
      await login(payload);
      router.replace('/');
    },
    [login, router],
  );

  return useMutation<void, LoginPayload>(loginFn);
}

export function useRegisterMutation() {
  const router = useRouter();
  const { register } = useAuth();

  const registerFn = useCallback(
    async (payload: CreateUserPayload) => {
      await register(payload);
    },
    [register],
  );

  const mutation = useMutation<void, CreateUserPayload>(registerFn);

  const registerAndRedirect = useCallback(
    async (payload: CreateUserPayload) => {
      await mutation.mutate(payload);
      setTimeout(() => router.replace('/profile'), 1500);
    },
    [mutation, router],
  );

  return { ...mutation, registerAndRedirect };
}
