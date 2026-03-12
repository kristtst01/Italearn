import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { validateAnswer } from '@/engine/validation';
import { getFirstCorrectAnswer } from '@/shared/utils/exercise';
import ExerciseShell from './ExerciseShell';

interface FillInBlankProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function FillInBlank({
  exercise,
  onComplete,
}: FillInBlankProps) {
  const [answer, setAnswer] = useState('');

  const correctAnswer = getFirstCorrectAnswer(exercise);

  const validation = useMemo(
    () => validateAnswer(answer, correctAnswer),
    [answer, correctAnswer],
  );

  // Split sentence on the blank marker (___) to render inline input
  const parts = exercise.sentence_context.split('___');

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={answer}
      isCorrect={validation.correct}
      canSubmit={answer.trim().length > 0}
      feedback={validation.feedback}
    >
      {exercise.prompt.text && (
        <p className="mb-4 text-sm text-gray-500">{exercise.prompt.text}</p>
      )}

      <p className="mb-6 text-lg font-semibold text-gray-900">
        {parts[0]}
        <span className="mx-1 inline-block min-w-[80px] border-b-2 border-blue-400 text-center">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="..."
            autoFocus
            className="w-full bg-transparent text-center text-blue-600 outline-none"
          />
        </span>
        {parts[1]}
      </p>
    </ExerciseShell>
  );
}
