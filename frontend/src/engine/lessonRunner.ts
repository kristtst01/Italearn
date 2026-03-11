import type { Exercise, ExerciseResult, Lesson } from '../types';
import { curriculum } from '../data/curriculum';
import { validateAnswer } from './validation';

export interface LessonResult {
  lessonId: string;
  score: number;
  total: number;
  timeMs: number;
  wordsEncountered: string[];
  results: ExerciseResult[];
}

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

/** Check whether a user answer is correct for a given exercise. */
export function checkAnswer(exercise: Exercise, userAnswer: string): boolean {
  const correct = exercise.correct_answer;
  const expected = Array.isArray(correct) ? correct.join(' ') : correct;
  return validateAnswer(userAnswer, expected).correct;
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
