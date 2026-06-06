import { useCallback, useEffect, useRef, useState } from 'react';
import { getToken } from '@/services/auth.service';

const API_BASE_URL = 'https://api-dm-69db35e2f2d0.herokuapp.com';

export interface UseFetchOptions {
  enabled?: boolean;
  immediate?: boolean;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

async function fetchWithAuth<T>(path: string): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { headers });

  if (!response.ok) {
    const body = await response.text();
    let message = `Erro ${response.status}`;

    try {
      const parsed = JSON.parse(body);
      message = parsed.detail || parsed.message || message;
    } catch {
      if (body) message = body;
    }

    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

export function useFetch<T>(
  path: string | null,
  options: UseFetchOptions = {},
): UseFetchResult<T> {
  const { enabled = true, immediate = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate && enabled && !!path);
  const [error, setError] = useState<string | null>(null);
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

    try {
      const result = await fetchWithAuth<T>(path);
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
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
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate && enabled && path) {
      refetch();
    }
  }, [path, enabled, immediate, refetch]);

  return { data, loading, error, refetch, reset };
}

export { fetchWithAuth, API_BASE_URL };
