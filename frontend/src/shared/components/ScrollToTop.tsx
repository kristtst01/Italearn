import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** Where each page was last scrolled to, by path, for this visit. */
const positions = new Map<string, number>();

import type { RESTORE_SCROLL } from '@/shared/utils/scroll';

// The app restores positions itself; the browser's own attempt would fight it on back navigation
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

/**
 * Scroll position across pages. BrowserRouter doesn't manage it, so without this a new page
 * opens wherever the last one was scrolled to.
 * - A new page starts at the top.
 * - Going back (the browser's back button, or a link with RESTORE_SCROLL) returns to where the
 *   page was left.
 * - Links to a section (#hash) are left alone; the page scrolls to the section itself.
 */
export default function ScrollToTop() {
  const { pathname, hash, state } = useLocation();
  const navigationType = useNavigationType();

  // Remember the position of the page being shown
  useEffect(() => {
    const save = () => positions.set(pathname, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [pathname]);

  useEffect(() => {
    if (hash) return;
    const restore = navigationType === 'POP' || (state as typeof RESTORE_SCROLL | null)?.restoreScroll;
    const y = restore ? positions.get(pathname) ?? 0 : 0;
    window.scrollTo(0, y);
    // Pages that load their content after the first render are too short to scroll yet: try again once it's there
    if (y > 0) {
      const retry = window.setTimeout(() => window.scrollTo(0, y), 150);
      return () => window.clearTimeout(retry);
    }
  }, [pathname, hash, state, navigationType]);

  return null;
}
