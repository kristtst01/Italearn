import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Leaves a session for the screen it was opened from. When there's no earlier page in the app
 * (the session was opened directly by URL), goes to `fallback` instead.
 */
export function useGoBack(fallback: string): () => void {
  const navigate = useNavigate();
  const { key } = useLocation();
  // React Router gives the first page of a visit the key "default"
  const hasHistory = key !== 'default';
  return useCallback(() => {
    if (hasHistory) navigate(-1);
    else navigate(fallback, { replace: true });
  }, [hasHistory, navigate, fallback]);
}
