import type { Exercise } from './exercise';

/** Where a note was sent from. Pages register this while they're open (useFeedbackContext). */
export interface FeedbackContext {
  kind: 'lesson' | 'review' | 'grammar' | 'grammar_session' | 'page';
  /** Short name of the place, shown on the chip and in the inbox ("Family & Pets · exercise 4") */
  label: string;
  /** Where the admin's link goes */
  path: string;
  lesson_id?: string;
  chapter_name?: string;
  grammar_id?: string;
  exercise_id?: string;
  exercise_number?: number;
  exercise_total?: number;
  /** Snapshot of the exercise on screen, so the AI and the admin see exactly what the learner saw */
  exercise?: Exercise;
  /** The heading a quoted passage sits under */
  heading?: string;
  /** The learner's last checked answer to this exercise, and what the app said */
  attempt?: FeedbackAttempt;
}

/** A checked answer, kept so feedback about it shows what was typed and how it was judged */
export interface FeedbackAttempt {
  exercise_id: string;
  answer: string;
  accepted: boolean;
  /** What the app showed under the answer (accent reminder, typo hint, AI check's reason) */
  feedback?: string;
}

export type FeedbackCategory =
  | 'italian_content'
  | 'english_wording'
  | 'vocabulary'
  | 'unclear_explanation'
  | 'taught_too_early'
  | 'difficulty'
  | 'missing_content'
  | 'answer_not_accepted'
  | 'ai_judgement'
  | 'bug'
  | 'progress_account'
  | 'review_scheduling'
  | 'audio'
  | 'design'
  | 'performance'
  | 'question'
  | 'idea'
  | 'praise'
  | 'other'
  | 'noise';

/** What a learner can pick when sending. The rest are the AI's (and the admin's) finer sorting. */
export type LearnerFeedbackCategory = Extract<
  FeedbackCategory,
  'italian_content' | 'answer_not_accepted' | 'unclear_explanation' | 'bug' | 'idea' | 'other'
>;

export type FeedbackStatus = 'new' | 'seen' | 'in_progress' | 'will_fix' | 'fixed' | 'wont_fix';
export type LearnerFeedbackStatus = 'received' | 'in_progress' | 'will_fix' | 'fixed' | 'wont_fix';

export interface MyFeedback {
  id: string;
  text: string;
  quote: string | null;
  context: Partial<FeedbackContext>;
  status: LearnerFeedbackStatus;
  learner_categories: LearnerFeedbackCategory[];
  reply: string | null;
  unread: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminFeedback {
  id: string;
  text: string;
  quote: string | null;
  context: Partial<FeedbackContext>;
  /** What the learner picked, if anything */
  learner_categories: LearnerFeedbackCategory[];
  /** A note can be several things at once. null: not sorted yet (the AI is working, or failed) */
  categories: FeedbackCategory[] | null;
  category_by_admin: boolean;
  summary: string | null;
  pressing: boolean;
  verdict: string | null;
  triaged_at: string | null;
  status: FeedbackStatus;
  reply: string | null;
  created_at: string;
  updated_at: string;
  user_name: string | null;
  user_is_me: boolean;
  /** The learner removed it from their own list */
  hidden_by_learner: boolean;
}

export interface FeedbackSummary {
  unread_updates: number;
  /** null for learners who aren't admins */
  inbox_new: number | null;
}
