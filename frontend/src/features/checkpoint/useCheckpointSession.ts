import { useState, useRef } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { buildCheckpointExercises } from '@/engine/checkpointRunner';
import type { CheckpointExerciseMap } from '@/engine/checkpointRunner';
import { useProgressStore } from '@/stores/progressStore';
import { calculateExerciseXP, getCheckpointBonusXP } from '@/engine/xp';

const PASS_THRESHOLD = 0.8;

export interface AreaResult {
  label: string;
  correct: number;
  total: number;
}

export interface CheckpointResult {
  score: number;
  total: number;
  passed: boolean;
  areas: AreaResult[];
}

const AREA_LABELS: Record<string, string> = {
  'unit-01': 'Unit 1: Greetings & Pronunciation',
  'unit-02': 'Unit 2: Introductions & Essere',
  'unit-03': 'Unit 3: Numbers & Avere',
  grammar: 'Grammar: Essere & Avere',
};

export function useCheckpointSession(sectionId: string) {
  const passCheckpoint = useProgressStore((s) => s.passCheckpoint);
  const addXP = useProgressStore((s) => s.addXP);
  const checkpointsPassed = useProgressStore((s) => s.checkpoints_passed);

  const alreadyPassed = checkpointsPassed.includes(sectionId);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [unitMap, setUnitMap] = useState<CheckpointExerciseMap>(new Map());
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [checkpointResult, setCheckpointResult] =
    useState<CheckpointResult | null>(null);
  const streakRef = useRef(0);

  const currentExercise = exercises[currentIndex] ?? null;
  const totalExercises = exercises.length;

  async function handleStart() {
    const built = await buildCheckpointExercises();
    setExercises(built.exercises);
    setUnitMap(built.unitMap);
    setStarted(true);
  }

  async function handleExerciseComplete(er: ExerciseResult) {
    // Track streak and award XP
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
      const finalResult = computeResult(updated, exercises, unitMap);
      setCheckpointResult(finalResult);
      if (finalResult.passed) {
        await passCheckpoint(sectionId);
        await addXP(getCheckpointBonusXP());
      }
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  return {
    alreadyPassed,
    started,
    currentExercise,
    currentIndex,
    totalExercises,
    checkpointResult,
    handleStart,
    handleExerciseComplete,
  };
}

function computeResult(
  results: ExerciseResult[],
  exercises: Exercise[],
  unitMap: CheckpointExerciseMap,
): CheckpointResult {
  const score = results.filter((r) => r.correct).length;
  const total = results.length;
  const passed = total > 0 && score / total >= PASS_THRESHOLD;

  // Tally per-area
  const areaTotals = new Map<string, { correct: number; total: number }>();
  for (const ex of exercises) {
    const area = unitMap.get(ex.id) ?? 'other';
    const result = results.find((r) => r.exercise_id === ex.id);
    if (!result) continue;
    const current = areaTotals.get(area) ?? { correct: 0, total: 0 };
    areaTotals.set(area, {
      correct: current.correct + (result.correct ? 1 : 0),
      total: current.total + 1,
    });
  }

  const areas: AreaResult[] = [...areaTotals.entries()].map(
    ([key, counts]) => ({
      label: AREA_LABELS[key] ?? key,
      ...counts,
    }),
  );

  return { score, total, passed, areas };
}
