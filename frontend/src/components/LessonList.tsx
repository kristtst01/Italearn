import { Link } from 'react-router-dom';
import type { Lesson } from '@/types';

interface LessonListProps {
  lessons: Lesson[];
  completedLessons: string[];
}

export default function LessonList({ lessons, completedLessons }: LessonListProps) {
  return (
    <div className="border-t border-gray-200 px-4 pb-3">
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);
        return (
          <Link
            key={lesson.id}
            to={`/lesson/${lesson.id}`}
            className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 -mx-1 px-1 rounded transition-colors"
          >
            {isCompleted ? (
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
            )}
            <span className={`flex-1 text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
              {lesson.name}
            </span>
            {!isCompleted && (
              <span className="text-xs font-medium text-blue-600">Start</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
