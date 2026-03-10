import type { ExerciseType } from './exercise';

export interface ExerciseResult {
  exercise_id: string;
  correct: boolean;
  user_answer: string;
  time_spent_ms: number;
}

export interface ReviewEntry {
  date: string;
  rating: number;
  response_time_ms: number;
}

export interface FSRSState {
  stability: number;
  difficulty: number;
  due: string;
  last_review: string;
}

export interface SRSCard {
  id: string;
  word_id: string;
  skill_type: ExerciseType;
  fsrs_state: FSRSState;
  review_log: ReviewEntry[];
}

export interface UserProgress {
  current_section: string;
  current_unit: string;
  current_lesson: string;
  xp: number;
  streak: number;
  level: number;
  lessons_completed: Set<string>;
  checkpoints_passed: Set<string>;
}
