import type { Exercise, ExerciseResult, LessonResult } from '../types';
import { loadLesson } from '../data/lessonLoader';

/** Load a lesson by ID (lazy — fetches the lesson chunk on demand). */
export { loadLesson as findLesson };

/** Collect all unique target words from the exercises. */
export function collectTargetWords(exercises: Exercise[]): string[] {
  const words = new Set<string>();
  for (const exercise of exercises) {
    for (const word of exercise.target_words) {
      words.add(word);
    }
  }
  return [...words];
}

/** Build a LessonResult from completed exercise results. */
export function buildLessonResult(
  lessonId: string,
  exercises: Exercise[],
  results: ExerciseResult[],
  startTime: number,
): LessonResult {
  const answered = results.filter((r) => !r.skipped);
  return {
    lessonId,
    score: answered.filter((r) => r.correct).length,
    total: answered.length,
    timeMs: Date.now() - startTime,
    wordsEncountered: collectTargetWords(exercises),
    results,
  };
}
