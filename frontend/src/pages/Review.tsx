import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Exercise, ExerciseResult, SRSCard } from '@/types';
import type { Grade } from 'ts-fsrs';
import { useSrsStore } from '@/stores/srsStore';
import { buildReviewExercises, answerToGrade } from '@/engine/reviewRunner';
import MultipleChoice from '@/components/exercises/MultipleChoice';
import TypeAnswer from '@/components/exercises/TypeAnswer';

interface ReviewSession {
  exercises: Exercise[];
  cardMap: Map<string, SRSCard>;
}

interface ReviewResult {
  total: number;
  correct: number;
}

export default function Review() {
  const navigate = useNavigate();
  const dueCards = useSrsStore((s) => s.dueCards);
  const hydrated = useSrsStore((s) => s.hydrated);
  const hydrate = useSrsStore((s) => s.hydrate);
  const reviewCard = useSrsStore((s) => s.reviewCard);

  const [session, setSession] = useState<ReviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<ReviewResult | null>(null);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  const currentExercise = session?.exercises[currentIndex] ?? null;
  const totalExercises = session?.exercises.length ?? 0;

  async function handleStart() {
    const built = await buildReviewExercises([...dueCards]);
    setSession(built);
  }

  async function handleExerciseComplete(er: ExerciseResult) {
    if (!session) return;

    const card = currentExercise
      ? session.cardMap.get(currentExercise.id)
      : undefined;
    if (card?.id != null) {
      const grade: Grade = answerToGrade(er.correct, er.time_spent_ms);
      await reviewCard(card.id, grade);
    }

    const newCorrect = correctCount + (er.correct ? 1 : 0);
    setCorrectCount(newCorrect);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalExercises) {
      setResult({ total: totalExercises, correct: newCorrect });
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  // Loading state
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Not started — show intro or empty state
  if (!session) {
    if (dueCards.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            &larr; Back to path
          </Link>
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
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          &larr; Back to path
        </Link>
        <div className="max-w-md mx-auto mt-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Review</h1>
          <p className="text-gray-600">
            {dueCards.length} card{dueCards.length !== 1 ? 's' : ''} due for
            review
          </p>
          <button
            onClick={handleStart}
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Start Review
          </button>
        </div>
      </div>
    );
  }

  // Completion screen
  if (result) {
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

  // Active review session
  const progress = ((currentIndex + 1) / totalExercises) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Exit review"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Review {currentIndex + 1}/{totalExercises}
          </span>
        </div>
      </div>

      {/* Exercise */}
      <div className="max-w-2xl mx-auto p-6">
        {currentExercise &&
          renderExercise(currentExercise, handleExerciseComplete)}
      </div>
    </div>
  );
}

function renderExercise(
  exercise: Exercise,
  onComplete: (result: ExerciseResult) => void,
) {
  const props = { exercise, onComplete };
  switch (exercise.subtype) {
    case 'multiple_choice':
      return <MultipleChoice key={exercise.id} {...props} />;
    case 'type_answer':
      return <TypeAnswer key={exercise.id} {...props} />;
    default:
      return (
        <div className="text-gray-500">
          Exercise type &ldquo;{exercise.subtype}&rdquo; is not supported in
          review.
        </div>
      );
  }
}
