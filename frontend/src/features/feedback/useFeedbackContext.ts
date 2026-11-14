import { useEffect } from 'react';
import { useFeedbackStore } from '@/stores/feedbackStore';
import type { FeedbackContext } from '@/types';

/**
 * Tells the feedback panel where the learner is while this page is open.
 * Pass null while the page has nothing specific (it falls back to the page name).
 */
export function useFeedbackContext(ctx: FeedbackContext | null) {
  const setPageContext = useFeedbackStore((s) => s.setPageContext);
  // Compare by content, so a new object each render doesn't loop
  const key = ctx ? JSON.stringify(ctx) : '';
  useEffect(() => {
    setPageContext(key ? (JSON.parse(key) as FeedbackContext) : null);
    return () => setPageContext(null);
  }, [key, setPageContext]);
}
