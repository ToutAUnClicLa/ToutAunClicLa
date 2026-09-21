// Cliente fetch del módulo Pro: añade el Bearer token y maneja JSON/errores.
import { PRO_API_BASE, PRO_TOKEN_KEY } from './config';

export class ProApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ProApiError';
    this.status = status;
    this.data = data;
  }
}

export function getProToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PRO_TOKEN_KEY);
}
export function setProToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem(PRO_TOKEN_KEY, token);
}
export function clearProToken(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(PRO_TOKEN_KEY);
}

interface ProFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

// path es relativo a /pro, p.ej. '/login', '/me', '/me/social'
export async function proFetch<T = unknown>(
  path: string,
  options: ProFetchOptions = {},
): Promise<T> {
  const token = getProToken();
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  if (!isForm && options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const body: BodyInit | undefined = isForm
    ? (options.body as BodyInit)
    : options.body !== undefined
      ? JSON.stringify(options.body)
      : undefined;

  const res = await fetch(`${PRO_API_BASE}/pro${path}`, {
    ...options,
    headers,
    body,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* respuesta sin cuerpo */
  }

  if (!res.ok) {
    const err = (data ?? {}) as { message?: string; error?: string };
    throw new ProApiError(err.message || err.error || `Error ${res.status}`, res.status, data);
  }
  return data as T;
}
