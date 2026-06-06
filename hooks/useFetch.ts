import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchWithAuth, FetchError } from '@/services/fetchClient';

export interface UseFetchOptions {
  enabled?: boolean;
  immediate?: boolean;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  errorStatus: number | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

export function useFetch<T>(
  path: string | null,
  options: UseFetchOptions = {},
): UseFetchResult<T> {
  const { enabled = true, immediate = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate && enabled && !!path);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    if (!path || !enabled) return;

    setLoading(true);
    setError(null);
    setErrorStatus(null);

    try {
      const result = await fetchWithAuth<T>(path);
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        if (err instanceof FetchError) {
          setError(err.message);
          setErrorStatus(err.status);
        } else {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [path, enabled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setErrorStatus(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate && enabled && path) {
      refetch();
    }
  }, [path, enabled, immediate, refetch]);

  return { data, loading, error, errorStatus, refetch, reset };
}

export { fetchWithAuth } from '@/services/fetchClient';
