import { useNavigate } from 'react-router-dom';
import type { ReviewResult } from '@/types';

interface ReviewSummaryProps {
  result: ReviewResult;
}

export default function ReviewSummary({ result }: ReviewSummaryProps) {
  const navigate = useNavigate();
  const pct =
    result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto mt-12 text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Review Complete!</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-4">
          <div>
            <p className="text-5xl font-bold text-blue-600">{pct}%</p>
            <p className="text-gray-500 mt-1">
              {result.correct}/{result.total} correct
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            {result.total} card{result.total !== 1 ? 's' : ''} reviewed
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          autoFocus
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Back to path
        </button>
      </div>
    </div>
  );
}
