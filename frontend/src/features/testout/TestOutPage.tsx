import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { curriculum } from '@/data/curriculum';
import ProgressBar from '@/shared/components/ProgressBar';
import CloseIcon from '@/shared/components/CloseIcon';
import renderExercise from '@/features/exercises/renderExercise';
import { useTestOutSession } from './useTestOutSession';
import { TEST_OUT_THRESHOLD } from '@/engine/testOutRunner';
import type { TestOutResult } from './useTestOutSession';

export default function TestOutPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  const unit = useMemo(() => {
    for (const section of curriculum.sections) {
      for (const u of section.units) {
        if (u.id === unitId) return u;
      }
    }
    return null;
  }, [unitId]);

  const {
    loading,
    noContent,
    started,
    currentExercise,
    currentIndex,
    totalExercises,
    testOutResult,
    handleStart,
    handleExerciseComplete,
  } = useTestOutSession(unitId ?? '');

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Unit not found</p>
          <button
            onClick={() => navigate('/path')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to path
          </button>
        </div>
      </div>
    );
  }

  if (noContent) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">This unit doesn't have vocabulary content yet.</p>
          <button
            onClick={() => navigate('/path')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to path
          </button>
        </div>
      </div>
    );
  }

  if (!started && !testOutResult) {
    return (
      <TestOutIntro
        unitName={unit.name}
        unitOrder={unit.order}
        loading={loading}
        onStart={handleStart}
        onBack={() => navigate('/path')}
      />
    );
  }

  if (testOutResult) {
    return (
      <TestOutResults
        result={testOutResult}
        unitName={unit.name}
      />
    );
  }

  const progress = ((currentIndex + 1) / totalExercises) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/path')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Exit test-out"
          >
            <CloseIcon />
          </button>
          <div className="flex-1">
            <ProgressBar progress={progress} />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {currentIndex + 1}/{totalExercises}
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

function TestOutIntro({
  unitName,
  unitOrder,
  loading,
  onStart,
  onBack,
}: {
  unitName: string;
  unitOrder: number;
  loading: boolean;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto mt-12 space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-gray-900">Test Out</h1>
          <p className="text-gray-500 mt-2">
            Unit {unitOrder}: {unitName}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Questions</span>
              <span className="font-medium text-gray-900">~12</span>
            </div>
            <div className="flex justify-between">
              <span>Pass score</span>
              <span className="font-medium text-gray-900">{TEST_OUT_THRESHOLD}%</span>
            </div>
            <div className="flex justify-between">
              <span>Focus</span>
              <span className="font-medium text-gray-900">Production (typing)</span>
            </div>
          </div>
          <hr className="border-gray-100" />
          <p className="text-sm text-gray-500">
            Already know this material? Pass the test to skip ahead.
            Mostly typing exercises — fewer multiple choice.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            disabled={loading}
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Start Test'}
          </button>
          <button
            onClick={onBack}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Back to path
          </button>
        </div>
      </div>
    </div>
  );
}

function TestOutResults({
  result,
  unitName,
}: {
  result: TestOutResult;
  unitName: string;
}) {
  const navigate = useNavigate();
  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto mt-12 space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">{result.passed ? '🎉' : '📚'}</div>
          <h1 className="text-3xl font-bold text-gray-900">
            {result.passed ? 'Test Passed!' : 'Not Quite Yet'}
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-2">
          <p
            className={`text-5xl font-bold ${result.passed ? 'text-green-600' : 'text-orange-500'}`}
          >
            {pct}%
          </p>
          <p className="text-gray-500">
            {result.score}/{result.total} correct
          </p>
          {result.passed ? (
            <p className="text-green-600 text-sm font-medium mt-2">
              {unitName} marked as complete!
            </p>
          ) : (
            <p className="text-orange-500 text-sm font-medium mt-2">
              Need {TEST_OUT_THRESHOLD}% to pass. We recommend working through the lessons.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/path')}
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Back to path
          </button>
        </div>
      </div>
    </div>
  );
}
