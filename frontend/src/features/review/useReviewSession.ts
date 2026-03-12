import { useState } from 'react';
import type { ExerciseResult, ReviewResult, ReviewSession } from '@/types';
import type { Grade } from 'ts-fsrs';
import { useSrsStore } from '@/stores/srsStore';
import { buildReviewExercises, answerToGrade } from '@/engine/reviewRunner';

export function useReviewSession() {
  const dueCards = useSrsStore((s) => s.dueCards);
  const reviewCard = useSrsStore((s) => s.reviewCard);

  const [session, setSession] = useState<ReviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<ReviewResult | null>(null);

  const currentExercise = session?.exercises[currentIndex] ?? null;
  const totalExercises = session?.exercises.length ?? 0;

  async function handleStart() {
    const built = await buildReviewExercises([...dueCards]);
    setSession(built);
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
    dueCards,
    session,
    currentExercise,
    currentIndex,
    totalExercises,
    result,
    handleStart,
    handleExerciseComplete,
  };
}
