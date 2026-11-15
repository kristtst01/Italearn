import type { AdminFeedback, FeedbackCategory, FeedbackContext, FeedbackStatus, FeedbackSummary, LearnerFeedbackCategory, MyFeedback } from '@/types';
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

  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- AI Validation ---

export type ValidateResult = {
  accepted: boolean;
  reason: string;
  cached: boolean;
};

export function validateAnswer(data: {
  exercise_type: string;
  prompt: string;
  sentence_context?: string;
  expected_answers: string[];
  user_answer: string;
}) {
  return request<ValidateResult>('/api/v1/ai/validate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- Free Response Grading ---

export type GradeFreeResponseResult = {
  accepted: boolean;
  feedback: string;
};

export function gradeFreeResponse(data: {
  prompt: string;
  correct_answer: string;
  user_answer: string;
  curriculum_context: string;
}) {
  return request<GradeFreeResponseResult>('/api/v1/ai/grade-free-response', {
    method: 'POST',
    body: JSON.stringify(data),
  });
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

export function resetProgress() {
  return request<Record<string, unknown>>('/api/v1/progress/reset', {
    method: 'DELETE',
  });
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

// --- AI ---

export type TranscribeResult = {
  text: string;
  language: string;
  language_probability: number;
  duration: number;
};

export async function transcribeAudio(audio: Blob, expectedText?: string): Promise<TranscribeResult> {
  const token = _getToken ? await _getToken() : null;

  const form = new FormData();
  form.append('audio', audio, 'recording.webm');
  if (expectedText) form.append('expected_text', expectedText);

  const res = await fetch(`${API_BASE}/api/v1/ai/transcribe`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json();
}

// --- Feedback ---

export function sendFeedback(data: {
  text: string;
  quote?: string | null;
  context: Partial<FeedbackContext>;
  categories?: LearnerFeedbackCategory[];
}) {
  return request<MyFeedback>('/api/v1/feedback', { method: 'POST', body: JSON.stringify(data) });
}

export function getMyFeedback() {
  return request<MyFeedback[]>('/api/v1/feedback/mine');
}

export function markMyFeedbackRead() {
  return request<void>('/api/v1/feedback/mine/read', { method: 'POST' });
}

/** Removes a note from the learner's list (the team keeps it). */
export function removeMyFeedback(id: string) {
  return request<void>(`/api/v1/feedback/mine/${id}`, { method: 'DELETE' });
}

export function getFeedbackSummary() {
  return request<FeedbackSummary>('/api/v1/feedback/summary');
}

export function getInbox() {
  return request<AdminFeedback[]>('/api/v1/admin/feedback');
}

export function markInboxSeen() {
  return request<void>('/api/v1/admin/feedback/mark-seen', { method: 'POST' });
}

export function updateFeedback(
  id: string,
  data: { status?: FeedbackStatus; categories?: FeedbackCategory[]; pressing?: boolean; reply?: string },
) {
  return request<AdminFeedback>(`/api/v1/admin/feedback/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

/** Deletes a note for good (admin): it also disappears from the learner's list. */
export function deleteFeedback(id: string) {
  return request<void>(`/api/v1/admin/feedback/${id}`, { method: 'DELETE' });
}

export function draftFeedbackReply(id: string) {
  return request<{ reply: string }>(`/api/v1/admin/feedback/${id}/draft-reply`, { method: 'POST' });
}

export function retriageFeedback(id: string) {
  return request<AdminFeedback>(`/api/v1/admin/feedback/${id}/retriage`, { method: 'POST' });
}
