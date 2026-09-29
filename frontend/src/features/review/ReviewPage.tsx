import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionHeader from '@/shared/components/SessionHeader';
import SessionLayout from '@/shared/components/SessionLayout';
import { toSegments } from '@/shared/utils/segments';
import { ExerciseProvider } from '@/shared/components/ExerciseContext';
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
    results,
    handleStart,
    handleExerciseComplete,
  } = useReviewSession(unitId);

  // Unit reviews start immediately — user explicitly chose to practice
  const autoStarted = useRef(false);
  useEffect(() => {
    if (unitId && !started && !autoStarted.current) {
      autoStarted.current = true;
      handleStart();
    }
  }, [unitId, started, handleStart]);

  if (!started) {
    if (unitId) return null; // loading while auto-starting
    return <ReviewIntro dueCount={reviewableCount} onStart={handleStart} />;
  }

  if (result) {
    return <ReviewSummary result={result} />;
  }

  return (
    <SessionLayout
      header={
        <SessionHeader
          context="Review"
          title={unitId ? 'Chapter review' : 'Due cards'}
          segments={toSegments(results, totalExercises)}
          counter={`${currentIndex + 1} / ${totalExercises}`}
          exit={
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Exit review"
            >
              <CloseIcon />
            </button>
          }
        />
      }
    >
      <ExerciseProvider value={{ hintsDisabled: true }}>
        {currentExercise &&
          renderExercise({
            exercise: currentExercise,
            onComplete: handleExerciseComplete,
          })}
      </ExerciseProvider>
    </SessionLayout>
  );
}
