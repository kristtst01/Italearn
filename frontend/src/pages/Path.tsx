import { Link } from 'react-router-dom'

export default function Path() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">ItaLearn</h1>
      <p className="text-gray-500 mb-8">Section 1: First Steps — A1</p>

      <div className="space-y-4">
        <Link
          to="/lesson/unit1-lesson1"
          className="block rounded-xl bg-white p-4 shadow-sm border border-gray-200 hover:border-green-400 transition-colors"
        >
          <h2 className="font-semibold text-gray-900">Unit 1: Greetings & Pronunciation</h2>
          <p className="text-sm text-gray-500">Available</p>
        </Link>
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
