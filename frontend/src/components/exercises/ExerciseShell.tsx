import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import Feedback from './Feedback';

interface ExerciseShellProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
  userAnswer: string;
  isCorrect: boolean;
  canSubmit: boolean;
  children: ReactNode;
}

export default function ExerciseShell({
  exercise,
  onComplete,
  userAnswer,
  isCorrect,
  canSubmit,
  children,
}: ExerciseShellProps) {
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const correctAnswer = Array.isArray(exercise.correct_answer)
    ? exercise.correct_answer.join(' ')
    : exercise.correct_answer;

  function handleSubmit() {
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

  return (
    <div className="flex min-h-[60vh] flex-col">
      {exercise.sentence_context && (
        <p className="mb-4 rounded-lg bg-gray-100 px-4 py-2 text-sm italic text-gray-600">
          {exercise.sentence_context}
        </p>
      )}

      <div className="flex-1">{children}</div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Check
        </button>
      )}

      {submitted && (
        <Feedback
          correct={isCorrect}
          correctAnswer={correctAnswer}
          exercise={exercise}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
