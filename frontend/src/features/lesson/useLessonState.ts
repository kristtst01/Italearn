import { useState, useRef, useMemo } from 'react';
import type { Exercise, ExerciseResult, GrammarTip, Lesson, LessonResult } from '@/types';
import { buildLessonResult } from '@/engine/lessonRunner';
import { calculateExerciseXP } from '@/engine/xp';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';


export type LessonStep =
  | { kind: 'exercise'; exercise: Exercise }
  | { kind: 'tip'; tip: GrammarTip };

function buildSteps(exercises: Exercise[], tips: GrammarTip[]): LessonStep[] {
  const steps: LessonStep[] = [];
  const tipsByPosition = new Map<number, GrammarTip[]>();

  for (const tip of tips) {
    const pos = tip.before_exercise ?? 0;
    const existing = tipsByPosition.get(pos) ?? [];
    existing.push(tip);
    tipsByPosition.set(pos, existing);
  }

  for (let i = 0; i < exercises.length; i++) {
    const tipsAtPosition = tipsByPosition.get(i);
    if (tipsAtPosition) {
      for (const tip of tipsAtPosition) {
        steps.push({ kind: 'tip', tip });
      }
    }
    steps.push({ kind: 'exercise', exercise: exercises[i] });
  }

  // Tips positioned after the last exercise
  const tipsAfter = tipsByPosition.get(exercises.length);
  if (tipsAfter) {
    for (const tip of tipsAfter) {
      steps.push({ kind: 'tip', tip });
    }
  }

  return steps;
}

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
  const addXP = useProgressStore((s) => s.addXP);
  const logActivity = useProgressStore((s) => s.logActivity);
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
  const streakRef = useRef(0);
  const pendingXPRef = useRef(0);

  const exercises = retryExercises ?? lesson.exercises;
  const isRetry = retryExercises !== null;

  // Build interleaved steps — no tips during retry
  const steps = useMemo(
    () => buildSteps(exercises, isRetry ? [] : lesson.grammar_tips),
    [exercises, isRetry, lesson.grammar_tips],
  );

  const currentStep = steps[currentIndex] as LessonStep | undefined;
  const isComplete = !!lessonResult;

  // Progress counts only exercises (tips don't count toward progress)
  const exerciseCount = exercises.length;
  const exercisesDone = results.length;
  const progress = (exercisesDone / exerciseCount) * 100;

  function handleExerciseComplete(result: ExerciseResult) {
    // Track streak, accumulate XP (awarded at lesson end)
    if (result.correct) {
      streakRef.current += 1;
    } else {
      streakRef.current = 0;
    }
    pendingXPRef.current += calculateExerciseXP(result.correct, streakRef.current);

    const updatedResults = [...results, result];
    setResults(updatedResults);
    advanceOrComplete(currentIndex, updatedResults);
  }

  function handleTipDismiss() {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
  }

  function advanceOrComplete(fromIndex: number, currentResults: ExerciseResult[]) {
    // Find the next step after the current one
    const nextIndex = fromIndex + 1;

    // Check if all exercises have been answered
    if (currentResults.length >= exerciseCount) {
      handleLessonComplete(currentResults);
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

    // Award all accumulated XP at once
    if (pendingXPRef.current > 0) {
      await addXP(pendingXPRef.current);
      pendingXPRef.current = 0;
    }

    if (isRetry && lessonScore) {
      const stillMissedIds = result.results
        .filter((r) => !r.correct)
        .map((r) => r.exercise_id);
      const mergedScore = lessonScore.total - stillMissedIds.length;
      await saveLessonScore(lesson.id, mergedScore, lessonScore.total, stillMissedIds);
    } else {
      const missedIds = result.results
        .filter((r) => !r.correct)
        .map((r) => r.exercise_id);
      await saveLessonScore(lesson.id, result.score, result.total, missedIds);
    }

    if (!isRetry) {
      await completeLesson(lesson.id);
      await logActivity('lesson');

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
    streakRef.current = 0;
  }

  return {
    exercises,
    steps,
    currentStep,
    currentIndex,
    exercisesDone,
    isComplete,
    isRetry,
    progress,
    lessonResult,
    handleExerciseComplete,
    handleTipDismiss,
    handlePracticeMistakes,
  };
}
