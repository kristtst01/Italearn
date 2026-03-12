import type { Exercise } from '@/types';

/** Get the correct answer as a single string (joins arrays with spaces). */
export function getCorrectAnswer(exercise: Exercise): string {
  return Array.isArray(exercise.correct_answer)
    ? exercise.correct_answer.join(' ')
    : exercise.correct_answer;
}

/** Get the first correct answer (for multiple-choice style exercises). */
export function getFirstCorrectAnswer(exercise: Exercise): string {
  return Array.isArray(exercise.correct_answer)
    ? exercise.correct_answer[0]
    : exercise.correct_answer;
}
