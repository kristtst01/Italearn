import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { getCorrectAnswer } from '@/shared/utils/exercise';
import Feedback from './Feedback';

interface ExerciseShellProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
  userAnswer: string;
  isCorrect: boolean;
  canSubmit: boolean;
  /** Optional feedback message from validation (e.g., accent reminders, typo hints) */
  feedback?: string;
  /** Optional async hook called before showing feedback (e.g., LLM validation) */
  onBeforeSubmit?: () => Promise<void>;
  children: ReactNode;
}

export default function ExerciseShell({
  exercise,
  onComplete,
  userAnswer,
  isCorrect,
  canSubmit,
  feedback,
  onBeforeSubmit,
  children,
}: ExerciseShellProps) {
  const [submitted, setSubmitted] = useState(false);
  const [validating, setValidating] = useState(false);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const correctAnswer = getCorrectAnswer(exercise);

  async function handleSubmit() {
    if (onBeforeSubmit) {
      setValidating(true);
      await onBeforeSubmit();
      setValidating(false);
    }
    setSubmitted(true);
  }

  function handleContinue() {
    onComplete({
      exercise_id: exercise.id,
      correct: isCorrect,
      user_answer: userAnswer,
      time_spent_ms: Date.now() - startTime.current,
    });
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (!submitted && !validating && canSubmit) {
        e.preventDefault();
        handleSubmit();
      } else if (submitted) {
        e.preventDefault();
        onComplete({
          exercise_id: exercise.id,
          correct: isCorrect,
          user_answer: userAnswer,
          time_spent_ms: Date.now() - startTime.current,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submitted, validating, canSubmit, isCorrect, userAnswer, exercise.id, onComplete],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex-1">{children}</div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || validating}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {validating ? 'Checking…' : 'Check'}
        </button>
      )}

      {submitted && (
        <Feedback
          correct={isCorrect}
          correctAnswer={correctAnswer}
          exercise={exercise}
          feedback={feedback}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
