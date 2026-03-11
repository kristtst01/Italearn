import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { validateAnswer } from '@/engine/validation';
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

  const correctAnswer = Array.isArray(exercise.correct_answer)
    ? exercise.correct_answer[0]
    : exercise.correct_answer;

  const validation = useMemo(
    () => validateAnswer(answer, correctAnswer),
    [answer, correctAnswer],
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
        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-blue-500"
      />
    </ExerciseShell>
  );
}
