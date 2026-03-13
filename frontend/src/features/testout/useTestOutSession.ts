import { useState, useRef } from 'react';
import type { Exercise, ExerciseResult, ExerciseType } from '@/types';
import { buildTestOutExercises, isTestOutPass } from '@/engine/testOutRunner';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { calculateExerciseXP } from '@/engine/xp';

export interface TestOutResult {
  score: number;
  total: number;
  passed: boolean;
}

export function useTestOutSession(unitId: string) {
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const addXP = useProgressStore((s) => s.addXP);
  const logActivity = useProgressStore((s) => s.logActivity);
  const addCards = useSrsStore((s) => s.addCards);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noContent, setNoContent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [testOutResult, setTestOutResult] = useState<TestOutResult | null>(null);
  const streakRef = useRef(0);

  const currentExercise = exercises[currentIndex] ?? null;
  const totalExercises = exercises.length;

  async function handleStart() {
    setLoading(true);
    const built = await buildTestOutExercises(unitId);
    setLoading(false);
    if (!built || built.length === 0) {
      setNoContent(true);
      return;
    }
    setExercises(built);
    setStarted(true);
  }

  async function handleExerciseComplete(er: ExerciseResult) {
    if (er.correct) {
      streakRef.current += 1;
    } else {
      streakRef.current = 0;
    }
    const xp = calculateExerciseXP(er.correct, streakRef.current);
    if (xp > 0) addXP(xp);

    const updated = [...results, er];
    setResults(updated);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalExercises) {
      const score = updated.filter((r) => r.correct).length;
      const total = updated.length;
      const passed = isTestOutPass(score, total);
      setTestOutResult({ score, total, passed });

      if (passed) {
        await handlePass();
      }
      await logActivity('lesson');
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  /** On pass: mark all unit lessons as complete + create SRS cards for vocab. */
  async function handlePass() {
    // We need the curriculum to find lessons for this unit
    const { curriculum } = await import('@/data/curriculum');
    for (const section of curriculum.sections) {
      for (const unit of section.units) {
        if (unit.id === unitId) {
          for (const lesson of unit.lessons) {
            await completeLesson(lesson.id);
          }
        }
      }
    }

    // Create SRS cards for all vocab in this unit
    const { db } = await import('@/stores/db');
    const vocab = await db.vocabulary.where('unit_id').equals(unitId).toArray();
    const cards: { wordId: string; skillType: ExerciseType }[] = [];
    for (const v of vocab) {
      cards.push({ wordId: v.id, skillType: 'vocab' });
      cards.push({ wordId: v.id, skillType: 'writing' });
    }
    await addCards(cards);
  }

  return {
    loading,
    noContent,
    started,
    currentExercise,
    currentIndex,
    totalExercises,
    testOutResult,
    handleStart,
    handleExerciseComplete,
  };
}
