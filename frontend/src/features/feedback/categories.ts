import type { FeedbackCategory, LearnerFeedbackCategory } from '@/types';

/*
 * Each category: the admin's name (inbox groups) and, for the few a learner can pick in the panel,
 * the learner's words for it. The rest are finer sorting done only by the AI (and the admin).
 */

export type CategoryFamily = 'content' | 'checking' | 'app' | 'people';

/** Grouped by what the admin has to do about a note. The dot colour shows the family. */
export const FAMILIES: { id: CategoryFamily; name: string; dot: string }[] = [
  { id: 'content', name: 'Content', dot: 'bg-correction' },
  { id: 'checking', name: 'Answer checking', dot: 'bg-in-progress' },
  { id: 'app', name: 'App', dot: 'bg-nero' },
  { id: 'people', name: 'Talk to learners', dot: 'bg-learned' },
];

const C = (name: string, family: CategoryFamily | null, learnerLabel?: string) => ({
  name,
  family,
  dot: family ? FAMILIES.find((f) => f.id === family)!.dot : 'bg-vuoto',
  learnerLabel,
});

export const CATEGORY: Record<
  FeedbackCategory,
  { name: string; family: CategoryFamily | null; dot: string; learnerLabel?: string }
> = {
  italian_content: C('Italian content', 'content', 'Mistake in the Italian'),
  english_wording: C('English wording', 'content'),
  vocabulary: C('Vocabulary', 'content'),
  unclear_explanation: C('Unclear explanation', 'content', 'Something is unclear'),
  taught_too_early: C('Taught too early', 'content'),
  difficulty: C('Difficulty & pace', 'content'),
  missing_content: C('Missing content', 'content'),
  answer_not_accepted: C('Answer not accepted', 'checking', 'My answer was marked wrong'),
  ai_judgement: C('AI judgement', 'checking'),
  bug: C('Bugs', 'app', 'Something is broken'),
  progress_account: C('Progress & account', 'app'),
  review_scheduling: C('Review & scheduling', 'app'),
  audio: C('Audio & speaking', 'app'),
  design: C('Layout & design', 'app'),
  performance: C('Speed', 'app'),
  question: C('Questions', 'people'),
  idea: C('Ideas', 'people', 'An idea'),
  praise: C('Praise', 'people'),
  other: C('Other', 'people', 'Something else'),
  noise: C('Probably noise', null),
};

/** Inbox order: by family, as listed above */
export const CATEGORY_ORDER = Object.keys(CATEGORY) as FeedbackCategory[];

/** What a learner can pick in the panel, in that order */
export const LEARNER_CATEGORIES: LearnerFeedbackCategory[] = [
  'italian_content',
  'answer_not_accepted',
  'unclear_explanation',
  'bug',
  'idea',
  'other',
];
