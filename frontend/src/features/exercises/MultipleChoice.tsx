import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { shuffle } from '@/shared/utils/shuffle';
import { getFirstCorrectAnswer } from '@/shared/utils/exercise';
import ExerciseShell from './ExerciseShell';

interface MultipleChoiceProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function MultipleChoice({
  exercise,
  onComplete,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const correctAnswer = getFirstCorrectAnswer(exercise);

  const options = useMemo(
    () => shuffle([correctAnswer, ...exercise.distractors]),
    [correctAnswer, exercise.distractors],
  );

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={selected ?? ''}
      isCorrect={selected === correctAnswer}
      canSubmit={selected !== null}
    >
      <p className="mb-6 text-lg font-semibold text-gray-900">
        {exercise.prompt.text}
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-colors ${
              selected === option
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </ExerciseShell>
  );
}
