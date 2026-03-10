import { Link } from 'react-router-dom'

export default function Review() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-blue-600 hover:underline text-sm">&larr; Back to path</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Review</h1>
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        <p className="text-gray-600">All caught up! No reviews right now.</p>
      </div>
    </div>
  )
}
