const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

let _getToken: (() => Promise<string | null>) | null = null;

/** Called once from App.tsx to wire up Clerk's getToken */
export function setTokenProvider(fn: () => Promise<string | null>) {
  _getToken = fn;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = _getToken ? await _getToken() : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Let Clerk handle re-auth
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json();
}

// --- Auth ---

export type UserInfo = { id: string; clerk_id: string; email: string; display_name: string | null };

export function getMe() {
  return request<UserInfo>('/api/v1/auth/me');
}

export function updateMe(data: { display_name?: string }) {
  return request<UserInfo>('/api/v1/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// --- Progress ---

export function getProgress() {
  return request<Record<string, unknown>>('/api/v1/progress');
}

export function updateProgress(data: Record<string, unknown>) {
  return request<Record<string, unknown>>('/api/v1/progress', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// --- SRS ---

export function getSrsCards() {
  return request<Record<string, unknown>[]>('/api/v1/srs/cards');
}

export function getDueSrsCards() {
  return request<Record<string, unknown>[]>('/api/v1/srs/due');
}

export function createSrsCards(cards: Record<string, unknown>[]) {
  return request<Record<string, unknown>[]>('/api/v1/srs/cards', {
    method: 'POST',
    body: JSON.stringify(cards),
  });
}

export function reviewSrsCard(cardId: string, data: Record<string, unknown>) {
  return request<Record<string, unknown>>(`/api/v1/srs/cards/${cardId}/review`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
