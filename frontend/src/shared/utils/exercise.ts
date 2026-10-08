import type { Exercise } from '@/types';

/**
 * The correct answer as one string. For arrange_words the array is the sentence's words in order,
 * so they're joined; for other types it lists accepted answers, and the first is the model answer.
 */
export function getCorrectAnswer(exercise: Exercise): string {
  if (!Array.isArray(exercise.correct_answer)) return exercise.correct_answer;
  return exercise.subtype === 'arrange_words' ? exercise.correct_answer.join(' ') : exercise.correct_answer[0];
}

/** Get the first correct answer (for multiple-choice style exercises). */
export function getFirstCorrectAnswer(exercise: Exercise): string {
  return Array.isArray(exercise.correct_answer)
    ? exercise.correct_answer[0]
    : exercise.correct_answer;
}
