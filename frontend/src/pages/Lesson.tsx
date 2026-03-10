import { useParams, Link } from 'react-router-dom'

export default function Lesson() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-blue-600 hover:underline text-sm">&larr; Back to path</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Lesson</h1>
      <p className="text-gray-500">Lesson ID: {id}</p>
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        <p className="text-gray-600">Exercises will appear here.</p>
      </div>
    </div>
  )
}
