import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { curriculum } from '@/data/curriculum';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';

/** Find the next lesson the user should do: first incomplete lesson across all units. */
function findNextLesson(completedLessons: string[]): { id: string; name: string; unitName: string } | null {
  const completed = new Set(completedLessons);

  for (const section of curriculum.sections) {
    for (const unit of section.units) {
      if (unit.lessons.length === 0) continue;

      // Check if previous unit is complete (skip for first unit)
      const sectionUnits = section.units;
      const unitIndex = sectionUnits.indexOf(unit);
      if (unitIndex > 0) {
        const prev = sectionUnits[unitIndex - 1];
        const prevComplete = prev.lessons.length > 0 && prev.lessons.every((l) => completed.has(l.id));
        if (!prevComplete) continue;
      }

      for (const lesson of unit.lessons) {
        if (!completed.has(lesson.id)) {
          return { id: lesson.id, name: lesson.name, unitName: unit.name };
        }
      }
    }
  }
  return null;
}

export default function QuickActions() {
  const completedLessons = useProgressStore((s) => s.lessons_completed);
  const dueCount = useSrsStore((s) => s.reviewableCount);

  const next = useMemo(() => findNextLesson(completedLessons), [completedLessons]);

  return (
    <div className="space-y-3 mb-6">
      {next && (
        <Link
          to={`/lesson/${next.id}`}
          className="flex items-center justify-between rounded-xl bg-green-600 text-white px-4 py-4 hover:bg-green-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Continue Learning</p>
              <p className="text-sm text-green-100">{next.unitName} — {next.name}</p>
            </div>
          </div>
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {dueCount > 0 && (
        <Link
          to="/review"
          className="flex items-center justify-between rounded-xl bg-blue-600 text-white px-4 py-4 hover:bg-blue-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div>
              <p className="font-semibold">Review</p>
              <p className="text-sm text-blue-100">{dueCount} card{dueCount !== 1 ? 's' : ''} ready for review</p>
            </div>
          </div>
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      <Link
        to="/path"
        className="flex items-center justify-between rounded-xl bg-white border border-gray-200 text-gray-700 px-4 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <div>
            <p className="font-semibold">Learning Path</p>
            <p className="text-sm text-gray-500">Browse all units and lessons</p>
          </div>
        </div>
        <svg className="w-5 h-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
