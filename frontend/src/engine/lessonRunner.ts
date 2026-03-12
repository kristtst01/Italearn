import type { Exercise, ExerciseResult, Lesson, LessonResult } from '../types';
import { curriculum } from '../data/curriculum';

/** Find a lesson by ID across all sections/units. */
export function findLesson(lessonId: string): Lesson | undefined {
  for (const section of curriculum.sections) {
    for (const unit of section.units) {
      for (const lesson of unit.lessons) {
        if (lesson.id === lessonId) return lesson;
      }
    }
  }
  return undefined;
}

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
  return {
    lessonId,
    score: results.filter((r) => r.correct).length,
    total: results.length,
    timeMs: Date.now() - startTime,
    wordsEncountered: collectTargetWords(exercises),
    results,
  };
}
