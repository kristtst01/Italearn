import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ChevronDown } from 'lucide-react';
import type { Unit, LessonScore, UnitStatus } from '@/types';
import LessonList from './LessonList';
import StatusIcon from './StatusIcon';

function getMasteryColor(percentage: number): string {
  if (percentage >= 80) return '#22c55e';
  if (percentage >= 50) return '#eab308';
  return '#fb923c';
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
          <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
            <CircularProgressbar
              value={mastery}
              text={`${mastery}%`}
              styles={buildStyles({
                pathColor: getMasteryColor(mastery),
                trailColor: '#e5e7eb',
                strokeLinecap: 'round',
                textSize: '28px',
                textColor: '#4b5563',
              })}
              strokeWidth={8}
            />
          </div>
        )}
        {!isLocked && unit.lessons.length > 0 && (
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
          />
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
