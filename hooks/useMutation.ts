import { useCallback, useRef, useState } from 'react';
import { FetchError } from '@/services/fetchClient';

export interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
): UseMutationResult<TData, TVariables> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mutationRef = useRef(mutationFn);

  mutationRef.current = mutationFn;

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setLoading(true);
    setError(null);

    try {
      return await mutationRef.current(variables);
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };

      const message =
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.message ||
        (err instanceof FetchError ? err.message : null) ||
        (err instanceof Error ? err.message : axiosError.message) ||
        'Ocorreu um erro. Tente novamente.';

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
}
