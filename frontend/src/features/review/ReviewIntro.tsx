import { useNavigate } from 'react-router-dom';

interface ReviewIntroProps {
  dueCount: number;
  onStart: () => void;
}

export default function ReviewIntro({ dueCount, onStart }: ReviewIntroProps) {
  const navigate = useNavigate();

  if (dueCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto mt-16 text-center space-y-4">
          <div className="text-5xl">&#10003;</div>
          <h1 className="text-2xl font-bold text-gray-900">All caught up!</h1>
          <p className="text-gray-500">
            No reviews right now. Come back later or keep learning.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Back to path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto mt-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Words are waiting</h1>
        <p className="text-gray-600">Practice your vocabulary to keep it fresh.</p>
        <button
          onClick={onStart}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Start
        </button>
      </div>
    </div>
  );
}
