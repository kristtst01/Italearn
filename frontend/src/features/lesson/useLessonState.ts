import { useState } from 'react';
import type { Exercise, ExerciseResult, Lesson, LessonResult } from '@/types';
import { buildLessonResult } from '@/engine/lessonRunner';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';

function getInitialRetryExercises(
  lesson: Lesson,
  missedExerciseIds?: string[],
): Exercise[] | null {
  if (!missedExerciseIds?.length) return null;
  const missedIds = new Set(missedExerciseIds);
  const missed = lesson.exercises.filter((ex) => missedIds.has(ex.id));
  return missed.length > 0 ? missed : null;
}

export function useLessonState(lesson: Lesson) {
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const saveLessonScore = useProgressStore((s) => s.saveLessonScore);
  const lessonScore = useProgressStore((s) => s.lesson_scores[lesson.id]);
  const addCards = useSrsStore((s) => s.addCards);

  // Auto-enter retry mode if reopening a lesson with missed exercises
  const [retryExercises, setRetryExercises] = useState<Exercise[] | null>(
    () => getInitialRetryExercises(lesson, lessonScore?.missedExerciseIds),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null);
  const [startTime, setStartTime] = useState(() => Date.now());

  const exercises = retryExercises ?? lesson.exercises;
  const isRetry = retryExercises !== null;
  const currentExercise = exercises[currentIndex];
  const isComplete = !!lessonResult;
  const progress =
    ((currentIndex + (isComplete ? 1 : 0)) / exercises.length) * 100;

  function handleExerciseComplete(result: ExerciseResult) {
    const updatedResults = [...results, result];
    setResults(updatedResults);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= exercises.length) {
      handleLessonComplete(updatedResults);
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  async function handleLessonComplete(finalResults: ExerciseResult[]) {
    const result = buildLessonResult(
      lesson.id,
      exercises,
      finalResults,
      startTime,
    );
    setLessonResult(result);

    if (isRetry && lessonScore) {
      const stillMissedIds = result.results
        .filter((r) => !r.correct)
        .map((r) => r.exercise_id);
      const newlyCorrect = exercises.length - stillMissedIds.length;
      const mergedScore = lessonScore.score + newlyCorrect;
      await saveLessonScore(lesson.id, mergedScore, lessonScore.total, stillMissedIds);
    } else {
      const missedIds = result.results
        .filter((r) => !r.correct)
        .map((r) => r.exercise_id);
      await saveLessonScore(lesson.id, result.score, result.total, missedIds);
    }

    if (!isRetry) {
      await completeLesson(lesson.id);

      const cardsToCreate: { wordId: string; skillType: 'vocab' | 'writing' }[] = [];
      for (const word of result.wordsEncountered) {
        for (const skillType of ['vocab', 'writing'] as const) {
          cardsToCreate.push({ wordId: word, skillType });
        }
      }
      if (cardsToCreate.length > 0) {
        await addCards(cardsToCreate);
      }
    }
  }

  function handlePracticeMistakes() {
    if (!lessonResult) return;

    const missedIds = new Set(
      lessonResult.results
        .filter((r) => !r.correct)
        .map((r) => r.exercise_id),
    );

    const missed = lesson.exercises.filter((ex) => missedIds.has(ex.id));
    if (missed.length === 0) return;

    setStartTime(Date.now());
    setRetryExercises(missed);
    setCurrentIndex(0);
    setResults([]);
    setLessonResult(null);
  }

  return {
    exercises,
    currentExercise,
    currentIndex,
    isComplete,
    isRetry,
    progress,
    lessonResult,
    handleExerciseComplete,
    handlePracticeMistakes,
  };
}
