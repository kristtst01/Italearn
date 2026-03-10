import { Link } from 'react-router-dom'
import { curriculum } from '@/data/curriculum'

export default function Path() {
  const section = curriculum.sections[0];
  const unit = section.units[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">ItaLearn</h1>
      <p className="text-gray-500 mb-8">{section.name} — {section.cefr_level}</p>

      <div className="space-y-4">
        {unit.lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lesson/${lesson.id}`}
            className="block rounded-xl bg-white p-4 shadow-sm border border-gray-200 hover:border-green-400 transition-colors"
          >
            <h2 className="font-semibold text-gray-900">{unit.name}: {lesson.name}</h2>
            <p className="text-sm text-gray-500">{lesson.exercises.length} exercises</p>
          </Link>
        ))}
      </div>

      <Link
        to="/review"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Review
      </Link>
    </div>
  )
}
