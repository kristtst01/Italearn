import { create } from 'zustand';
import { getFeedbackSummary } from '@/engine/api';
import type { FeedbackContext, FeedbackSummary, LearnerFeedbackCategory } from '@/types';

/**
 * The feedback panel. Pages register where the learner is (useFeedbackContext); opening the
 * panel attaches that place, which the learner can remove. Quoting is a mode the panel starts.
 */
interface FeedbackState {
  /** Where the learner is now, set by the page that's open */
  pageContext: FeedbackContext | null;
  open: boolean;
  /** The place attached to the note being written (null once removed) */
  attached: FeedbackContext | null;
  quote: { text: string; heading?: string } | null;
  selecting: boolean;
  draft: string;
  /** Optional: what kind of feedback, if the learner wants to say (any number) */
  categories: LearnerFeedbackCategory[];
  summary: FeedbackSummary | null;

  setPageContext: (ctx: FeedbackContext | null) => void;
  openPanel: () => void;
  closePanel: () => void;
  removeAttached: () => void;
  setDraft: (text: string) => void;
  toggleCategory: (category: LearnerFeedbackCategory) => void;
  startSelecting: () => void;
  stopSelecting: () => void;
  setQuote: (quote: { text: string; heading?: string } | null) => void;
  reset: () => void;
  refreshSummary: () => Promise<void>;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  pageContext: null,
  open: false,
  attached: null,
  quote: null,
  selecting: false,
  draft: '',
  categories: [],
  summary: null,

  setPageContext: (ctx) => set({ pageContext: ctx }),
  openPanel: () => {
    const { pageContext } = get();
    const path = window.location.pathname;
    set({
      open: true,
      selecting: false,
      // Keep a note in progress (and its quote) if the panel is reopened on the same page
      attached: pageContext ?? { kind: 'page', label: pageLabel(path), path },
    });
  },
  closePanel: () => set({ open: false, selecting: false }),
  removeAttached: () => set({ attached: null }),
  setDraft: (draft) => set({ draft }),
  toggleCategory: (c) =>
    set(({ categories }) => ({ categories: categories.includes(c) ? categories.filter((x) => x !== c) : [...categories, c] })),
  startSelecting: () => {
    window.getSelection()?.removeAllRanges();
    set({ selecting: true });
  },
  stopSelecting: () => set({ selecting: false }),
  setQuote: (quote) => set({ quote, selecting: false }),
  reset: () => set({ open: false, selecting: false, attached: null, quote: null, draft: '', categories: [] }),
  refreshSummary: async () => {
    try {
      set({ summary: await getFeedbackSummary() });
    } catch (err) {
      console.error('Failed to load feedback summary:', err);
    }
  },
}));

const PAGE_NAMES: Record<string, string> = {
  '': 'Today',
  library: 'Library',
  grammar: 'Grammar',
  progress: 'Progress',
  profile: 'Profile',
};

function pageLabel(path: string): string {
  return PAGE_NAMES[path.split('/')[1] ?? ''] ?? path;
}
