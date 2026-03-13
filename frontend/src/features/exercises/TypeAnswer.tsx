import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { validateAnswerMulti } from '@/engine/validation';
import ExerciseShell from './ExerciseShell';

interface TypeAnswerProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function TypeAnswer({
  exercise,
  onComplete,
}: TypeAnswerProps) {
  const [answer, setAnswer] = useState('');

  const validation = useMemo(
    () => validateAnswerMulti(answer, exercise.correct_answer),
    [answer, exercise.correct_answer],
  );

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={answer}
      isCorrect={validation.correct}
      canSubmit={answer.trim().length > 0}
      feedback={validation.feedback}
    >
      <p className="mb-6 text-lg font-semibold text-gray-900">
        {exercise.prompt.text}
      </p>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer…"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-blue-500"
      />
    </ExerciseShell>
  );
}
