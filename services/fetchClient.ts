import { API_BASE_URL } from '@/constants/api';
import { getToken } from '@/services/auth.service';

export class FetchError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchWithAuth<T>(path: string): Promise<T> {
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

    throw new FetchError(message, response.status);
  }

  return response.json() as Promise<T>;
}
