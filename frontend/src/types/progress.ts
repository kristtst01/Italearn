import type { Card as FSRSCard, ReviewLog } from 'ts-fsrs';
import type { ExerciseType } from './exercise';

export interface ExerciseResult {
  exercise_id: string;
  correct: boolean;
  user_answer: string;
  time_spent_ms: number;
}

/** Stored in Dexie — one row per (word_id, skill_type) pair */
export interface SRSCard {
  id?: number;
  word_id: string;
  skill_type: ExerciseType;
  due: Date;
  card: FSRSCard;
  review_log: ReviewLog[];
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
  checkpoints_passed: string[];
}
