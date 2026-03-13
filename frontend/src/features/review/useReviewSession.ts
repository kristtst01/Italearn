import { useState, useRef } from 'react';
import type { ExerciseResult, ReviewResult, ReviewSession } from '@/types';
import type { Grade } from 'ts-fsrs';
import { useSrsStore } from '@/stores/srsStore';
import { useProgressStore } from '@/stores/progressStore';
import { buildReviewExercises, answerToGrade } from '@/engine/reviewRunner';
import { calculateReviewXP } from '@/engine/xp';

export function useReviewSession() {
  const dueCards = useSrsStore((s) => s.dueCards);
  const reviewableCount = useSrsStore((s) => s.reviewableCount);
  const reviewCard = useSrsStore((s) => s.reviewCard);
  const addXP = useProgressStore((s) => s.addXP);

  const [session, setSession] = useState<ReviewSession | null>(null);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const streakRef = useRef(0);

  const currentExercise = session?.exercises[currentIndex] ?? null;
  const totalExercises = session?.exercises.length ?? reviewableCount;

  async function handleStart() {
    const built = await buildReviewExercises([...dueCards]);
    setSession(built);
    if (built.exercises.length === 0) {
      setResult({ total: 0, correct: 0 });
    } else {
      setStarted(true);
    }
  }

  async function handleExerciseComplete(er: ExerciseResult) {
    if (!session) return;

    const card = currentExercise
      ? session.cardMap.get(currentExercise.id)
      : undefined;
    if (card?.id != null) {
      const grade: Grade = answerToGrade(er.correct, er.time_spent_ms);
      await reviewCard(card.id, grade);
    }

    // Track streak and award review XP
    if (er.correct) {
      streakRef.current += 1;
    } else {
      streakRef.current = 0;
    }
    const xp = calculateReviewXP(er.correct, streakRef.current);
    if (xp > 0) addXP(xp);

    const newCorrect = correctCount + (er.correct ? 1 : 0);
    setCorrectCount(newCorrect);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalExercises) {
      setResult({ total: totalExercises, correct: newCorrect });
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  return {
    reviewableCount,
    started,
    session,
    currentExercise,
    currentIndex,
    totalExercises,
    result,
    handleStart,
    handleExerciseComplete,
  };
}
