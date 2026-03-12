import { Link } from 'react-router-dom';
import type { LessonMeta, LessonScore } from '@/types';

interface LessonListProps {
  lessons: LessonMeta[];
  completedLessons: string[];
  lessonScores: Record<string, LessonScore>;
  onResetLesson: (lessonId: string) => void;
}

export default function LessonList({ lessons, completedLessons, lessonScores, onResetLesson }: LessonListProps) {
  return (
    <div className="border-t border-gray-200 px-4 pb-3">
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const score = lessonScores[lesson.id];
        const isPerfect = score && score.score === score.total;

        return (
          <div
            key={lesson.id}
            className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0 -mx-1 px-1"
          >
            <Link
              to={`/lesson/${lesson.id}`}
              className="flex items-center gap-3 flex-1 min-w-0 hover:bg-gray-50 rounded transition-colors"
            >
              {isCompleted ? (
                isPerfect ? (
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold text-amber-600 flex-shrink-0 w-5 text-center">
                    {score ? `${score.score}/${score.total}` : '?'}
                  </span>
                )
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              <span className={`flex-1 text-sm truncate ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
                {lesson.name}
              </span>
              {!isCompleted && (
                <span className="text-xs font-medium text-blue-600">Start</span>
              )}
            </Link>
            {isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetLesson(lesson.id);
                }}
                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label={`Reset ${lesson.name}`}
                title="Reset lesson progress"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
