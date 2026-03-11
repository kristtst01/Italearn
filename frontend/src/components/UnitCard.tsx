import type { Unit, LessonScore } from '@/types';
import LessonList from './LessonList';

export type UnitStatus = 'locked' | 'available' | 'in_progress' | 'completed';

interface UnitCardProps {
  unit: Unit;
  status: UnitStatus;
  completedLessons: string[];
  lessonScores: Record<string, LessonScore>;
  onResetLesson: (lessonId: string) => void;
  expanded: boolean;
  onToggle: () => void;
}

export default function UnitCard({
  unit,
  status,
  completedLessons,
  lessonScores,
  onResetLesson,
  expanded,
  onToggle,
}: UnitCardProps) {
  const isLocked = status === 'locked';
  const lessonsCompleted = unit.lessons.filter((l) =>
    completedLessons.includes(l.id),
  ).length;

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isLocked
          ? 'border-gray-200 bg-gray-100 opacity-60'
          : status === 'completed'
            ? 'border-green-300 bg-green-50'
            : status === 'in_progress'
              ? 'border-blue-300 bg-white'
              : 'border-gray-200 bg-white'
      }`}
    >
      <button
        onClick={isLocked ? undefined : onToggle}
        disabled={isLocked}
        className={`w-full flex items-center gap-3 p-4 text-left ${
          isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <StatusIcon status={status} />
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold truncate ${
              isLocked ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            {unit.name}
          </h3>
          <p className={`text-sm ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
            {unit.grammar_focus}
          </p>
          {status === 'in_progress' && unit.lessons.length > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              Lesson {lessonsCompleted}/{unit.lessons.length}
            </p>
          )}
        </div>
        {!isLocked && unit.lessons.length > 0 && (
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {expanded && !isLocked && unit.lessons.length > 0 && (
        <LessonList
          lessons={unit.lessons}
          completedLessons={completedLessons}
          lessonScores={lessonScores}
          onResetLesson={onResetLesson}
        />
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: UnitStatus }) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0';

  switch (status) {
    case 'locked':
      return (
        <div className={`${base} bg-gray-200`}>
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      );
    case 'available':
      return (
        <div className={`${base} bg-blue-100`}>
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        </div>
      );
    case 'in_progress':
      return (
        <div className={`${base} bg-blue-100`}>
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case 'completed':
      return (
        <div className={`${base} bg-green-100`}>
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
  }
}
