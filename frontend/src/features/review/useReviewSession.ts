import { useState, useRef } from 'react';
import type { ExerciseResult, ReviewResult, ReviewSession } from '@/types';
import type { Grade } from 'ts-fsrs';
import { useSrsStore } from '@/stores/srsStore';
import { useProgressStore } from '@/stores/progressStore';
import { buildReviewExercises, getLearnedCardsForUnit, answerToGrade } from '@/engine/reviewRunner';
import { calculateReviewXP } from '@/engine/xp';

export function useReviewSession(unitId?: string) {
  const dueCards = useSrsStore((s) => s.dueCards);
  const allCards = useSrsStore((s) => s.allCards);
  const reviewableCount = useSrsStore((s) => s.reviewableCount);
  const reviewCard = useSrsStore((s) => s.reviewCard);
  const addXP = useProgressStore((s) => s.addXP);
  const logActivity = useProgressStore((s) => s.logActivity);

  const [session, setSession] = useState<ReviewSession | null>(null);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const streakRef = useRef(0);

  const currentExercise = session?.exercises[currentIndex] ?? null;
  const totalExercises = session?.exercises.length ?? reviewableCount;

  async function handleStart() {
    const raw = unitId
      ? getLearnedCardsForUnit(unitId, allCards)
      : [...dueCards];
    // Take the 20 most overdue cards, sorted by due date (most pressing first)
    const cards = raw
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
      .slice(0, 20);
    const built = buildReviewExercises(cards);
    setSession(built);
    if (built.exercises.length === 0) {
      setResult({ total: 0, correct: 0 });
    } else {
      setStarted(true);
    }
  }

  async function handleExerciseComplete(er: ExerciseResult) {
    if (!session) return;

    // Skipped exercises don't grade SRS cards or affect streak/XP
    if (!er.skipped) {
      const cards = currentExercise
        ? session.cardMap.get(currentExercise.id)
        : undefined;
      if (cards) {
        const grade: Grade = answerToGrade(er.correct, er.time_spent_ms);
        for (const card of cards) {
          if (card.id != null) await reviewCard(card.id, grade);
        }
      }

      if (er.correct) {
        streakRef.current += 1;
      } else {
        streakRef.current = 0;
      }
      const xp = calculateReviewXP(er.correct, streakRef.current);
      if (xp > 0) addXP(xp);
    }

    const newCorrect = correctCount + (er.correct ? 1 : 0);
    setCorrectCount(newCorrect);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalExercises) {
      await logActivity('review');
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
