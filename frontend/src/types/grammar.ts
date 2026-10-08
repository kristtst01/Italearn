import type { Exercise } from './exercise';

/** A grammar point a unit's exercises test, and the reading section that teaches it. */
export interface GrammarPoint {
  label: string;
  /** Heading in the unit's reading (the "send you back" link after a failed check) */
  section: string;
}

/** A short practice session placed in the reading, right after the section it practises. */
export interface GrammarStop {
  id: string;
  title: string;
  /** Heading of the section it follows (the stop comes before the next heading) */
  after: string;
  exercises: Exercise[];
}

/** Practice stops and mastery check for one grammar unit (data/grammar/<id>.practice.json). */
export interface GrammarPractice {
  unit_id: string;
  points: Record<string, GrammarPoint>;
  stops: GrammarStop[];
  mastery: {
    /** Share of the check needed to pass, 0–1 */
    pass_mark: number;
    exercises: Exercise[];
  };
}

/** A grammar unit's reading (data/grammar/<id>.md). */
export interface GrammarUnitContent {
  id: string;
  /** Markdown body, without the front matter */
  body: string;
  sources: string[];
}

export interface MasteryAttempt {
  score: number;
  total: number;
  passed: boolean;
  at: string;
  /** Grammar points with at least one wrong answer */
  missedPoints: string[];
}

/** Stored per grammar unit in UserProgress.grammar_units. Timestamps are ISO strings. */
export interface GrammarUnitProgress {
  studiedAt?: string;
  /** Practice stops completed at least once */
  stopsDone?: string[];
  /** When the last remaining practice stop was completed */
  practisedAt?: string;
  learnedAt?: string;
  lastCheck?: MasteryAttempt;
}
