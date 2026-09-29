import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { getCorrectAnswer } from '@/shared/utils/exercise';
import { buttonVariants } from '@/components/ui/button';
import Feedback from './Feedback';
import { ActionBar } from './ui';

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

  function handleSkip() {
    onComplete({
      exercise_id: exercise.id,
      correct: false,
      user_answer: '',
      time_spent_ms: Date.now() - startTime.current,
      skipped: true,
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
    <div className="flex flex-col gap-8 pb-44">
      {children}

      {!submitted && (
        <ActionBar>
          <button type="button" onClick={handleSkip} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Skip
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || validating}
            className={buttonVariants({ size: 'xl', className: 'min-w-40' })}
          >
            {validating ? 'Checking…' : 'Check'}
          </button>
        </ActionBar>
      )}

      {submitted && (
        <Feedback
          correct={isCorrect}
          correctAnswer={correctAnswer}
          userAnswer={userAnswer}
          exercise={exercise}
          feedback={feedback}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
