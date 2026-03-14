import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { validateAnswerMulti } from '@/engine/validation';
import HighlightedText from '@/shared/components/HighlightedText';
import ExerciseShell from './ExerciseShell';

interface ClozeDeleteProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function ClozeDelete({
  exercise,
  onComplete,
}: ClozeDeleteProps) {
  const [answer, setAnswer] = useState('');

  const validation = useMemo(
    () => validateAnswerMulti(answer, exercise.correct_answer),
    [answer, exercise.correct_answer],
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
        <p className="mb-2 text-sm text-gray-500">
          <HighlightedText text={exercise.prompt.text} words={exercise.target_words} />
        </p>
      )}

      {exercise.hints.length > 0 && (
        <p className="mb-4 text-base italic text-gray-600">
          {exercise.hints[0]}
        </p>
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
