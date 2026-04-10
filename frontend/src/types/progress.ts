import type { Card as FSRSCard, ReviewLog } from 'ts-fsrs';
import type { Exercise, ExerciseType } from './exercise';

export interface ExerciseResult {
  exercise_id: string;
  correct: boolean;
  user_answer: string;
  time_spent_ms: number;
  skipped?: boolean;
}

export interface SRSCard {
  id?: number;
  /** UUID from backend API */
  api_id?: string;
  word_id: string;
  skill_type: ExerciseType;
  due: Date;
  card: FSRSCard;
  review_log: ReviewLog[];
  /** When this card was first created (from backend) */
  created_at?: string;
}

/** Stored in Dexie — one row per word/phrase. Keyed by word_id. */
export interface VocabEntry {
  /** Primary key — matches SRSCard.word_id (e.g. "ciao", "buongiorno") */
  id: string;
  /** Italian word or phrase */
  word: string;
  /** English translation */
  meaning: string;
  /** Example sentence in Italian */
  example: string;
  /** Unit that introduced this word */
  unit_id: string;
  /** ISO date string — set when user first encounters word in a lesson */
  learned_at?: string;
}

export interface LessonScore {
  score: number;
  total: number;
  /** Exercise IDs the user got wrong (empty when perfect) */
  missedExerciseIds: string[];
}

export interface ReviewSession {
  exercises: Exercise[];
  /** Maps exercise ID → SRS card(s). Match-pairs exercises map to multiple cards. */
  cardMap: Map<string, SRSCard[]>;
}

export interface ReviewResult {
  total: number;
  correct: number;
}

export interface LessonResult {
  lessonId: string;
  score: number;
  total: number;
  timeMs: number;
  wordsEncountered: string[];
  results: ExerciseResult[];
}

/** Stored in Dexie — singleton row (id = 1) */
export interface UserProgress {
  id?: number;
  current_section: string;
  current_unit: string;
  current_lesson: string;
  xp: number;
  streak: number;
  level: number;
  lessons_completed: string[];
  /** Best score per lesson, keyed by lesson ID */
  lesson_scores: Record<string, LessonScore>;
  /** Badges earned for passing section checkpoints */
  badges: Badge[];
  /** ISO date strings (YYYY-MM-DD) of days the user was active */
  streak_dates: string[];
  /** Daily activity counts, keyed by ISO date string */
  daily_activity: Record<string, DailyActivity>;
}

/** Daily activity counters for streak threshold evaluation */
export interface DailyActivity {
  lessons: number;
  reviews: number;
}

/** Badge earned for passing a section checkpoint */
export interface Badge {
  sectionId: string;
  earnedAt: string; // ISO date string
}

/** Stored in Dexie — one row per day for daily XP tracking */
export interface XPLogEntry {
  /** ISO date string YYYY-MM-DD */
  date: string;
  /** Total XP earned on this date */
  xp: number;
}
