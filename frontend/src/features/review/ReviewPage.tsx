import { useNavigate, useSearchParams } from 'react-router-dom';
import ProgressBar from '@/shared/components/ProgressBar';
import CloseIcon from '@/shared/components/CloseIcon';
import renderExercise from '@/features/exercises/renderExercise';
import { useReviewSession } from './useReviewSession';
import ReviewIntro from './ReviewIntro';
import ReviewSummary from './ReviewSummary';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const unitId = searchParams.get('unit') ?? undefined;

  const {
    reviewableCount,
    started,
    currentExercise,
    currentIndex,
    totalExercises,
    result,
    handleStart,
    handleExerciseComplete,
  } = useReviewSession(unitId);

  if (!started) {
    return <ReviewIntro dueCount={reviewableCount} onStart={handleStart} />;
  }

  if (result) {
    return <ReviewSummary result={result} />;
  }

  const progress = ((currentIndex + 1) / totalExercises) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Exit review"
          >
            <CloseIcon />
          </button>
          <div className="flex-1">
            <ProgressBar progress={progress} />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Review {currentIndex + 1}/{totalExercises}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {currentExercise &&
          renderExercise({
            exercise: currentExercise,
            onComplete: handleExerciseComplete,
          })}
      </div>
    </div>
  );
}
