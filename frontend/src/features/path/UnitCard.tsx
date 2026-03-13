import type { Unit, LessonScore, UnitStatus } from '@/types';
import LessonList from './LessonList';
import StatusIcon from './StatusIcon';

interface MasteryRingProps {
  percentage: number;
  size?: number;
}

function MasteryRing({ percentage, size = 40 }: MasteryRingProps) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 80 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-orange-400';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className="text-[10px] font-bold text-gray-600">{percentage}%</span>
    </div>
  );
}

interface UnitCardProps {
  unit: Unit;
  status: UnitStatus;
  completedLessons: string[];
  lessonScores: Record<string, LessonScore>;
  mastery: number | undefined;
  onResetLesson: (lessonId: string) => void;
  expanded: boolean;
  onToggle: () => void;
}

export default function UnitCard({
  unit,
  status,
  completedLessons,
  lessonScores,
  mastery,
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
        {!isLocked && mastery !== undefined && mastery > 0 && (
          <MasteryRing percentage={mastery} />
        )}
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
