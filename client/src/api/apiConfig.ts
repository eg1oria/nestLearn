const API_URL = 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

type NestErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function normalizeErrorMessage(body: unknown, fallback: string) {
  const b = body as NestErrorBody | null;

  if (!b) return fallback;

  if (typeof b.message === 'string') return b.message;
  if (Array.isArray(b.message)) return b.message.join(', ');
  if (typeof b.error === 'string') return b.error;

  return fallback;
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const text = await res.text().catch(() => '');
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const msg = normalizeErrorMessage(data, `Request failed: ${res.status}`);
    throw new Error(msg);
  }

  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export type Utils = { id: string; createdAt: string; updatedAt: string };
