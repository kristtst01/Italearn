import { useState } from 'react';
import { Link } from 'react-router-dom';
import { curriculum } from '@/data/curriculum';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import type { Unit, UnitStatus } from '@/types';
import UnitCard from './UnitCard';

function getUnitStatus(
  unit: Unit,
  completedLessons: string[],
  isUnlocked: boolean,
): UnitStatus {
  if (!isUnlocked) return 'locked';
  if (unit.lessons.length === 0) return 'available';

  const completed = unit.lessons.filter((l) =>
    completedLessons.includes(l.id),
  ).length;

  if (completed === unit.lessons.length) return 'completed';
  if (completed > 0) return 'in_progress';
  return 'available';
}

function isUnitComplete(unit: Unit, completedLessons: string[]): boolean {
  return (
    unit.lessons.length > 0 &&
    unit.lessons.every((l) => completedLessons.includes(l.id))
  );
}

export default function Path() {
  const section = curriculum.sections[0];
  const units = section.units;

  const lessonsCompleted = useProgressStore((s) => s.lessons_completed);
  const lessonScores = useProgressStore((s) => s.lesson_scores);
  const resetLesson = useProgressStore((s) => s.resetLesson);
  const dueCount = useSrsStore((s) => s.dueCards.length);

  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">ItaLearn</h1>
        <p className="text-gray-500 mb-6">
          Section {section.order}: {section.name} — {section.cefr_level}
        </p>

        {dueCount > 0 && (
          <Link
            to="/review"
            className="flex items-center justify-between rounded-xl bg-blue-600 text-white px-4 py-3 mb-6 hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium">Review</span>
            </div>
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-sm font-medium">
              {dueCount} due
            </span>
          </Link>
        )}

        <div className="space-y-3">
          {units.map((unit, index) => {
            const isUnlocked =
              index === 0 ||
              isUnitComplete(units[index - 1], lessonsCompleted);

            const status = getUnitStatus(unit, lessonsCompleted, isUnlocked);

            return (
              <UnitCard
                key={unit.id}
                unit={unit}
                status={status}
                completedLessons={lessonsCompleted}
                lessonScores={lessonScores}
                onResetLesson={resetLesson}
                expanded={expandedUnit === unit.id}
                onToggle={() =>
                  setExpandedUnit(expandedUnit === unit.id ? null : unit.id)
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
