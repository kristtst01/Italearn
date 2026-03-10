import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import ExerciseShell from './ExerciseShell';

interface ArrangeWordsProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ArrangeWords({
  exercise,
  onComplete,
}: ArrangeWordsProps) {
  const correctAnswer = Array.isArray(exercise.correct_answer)
    ? exercise.correct_answer.join(' ')
    : exercise.correct_answer;

  const words = useMemo(
    () => shuffle(correctAnswer.split(' ')),
    [correctAnswer],
  );

  const [placed, setPlaced] = useState<number[]>([]);

  const remaining = words
    .map((word, i) => ({ word, i }))
    .filter(({ i }) => !placed.includes(i));

  const userAnswer = placed.map((i) => words[i]).join(' ');
  const isCorrect = userAnswer === correctAnswer;

  function addWord(index: number) {
    setPlaced((prev) => [...prev, index]);
  }

  function removeWord(positionIndex: number) {
    setPlaced((prev) => prev.filter((_, i) => i !== positionIndex));
  }

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={userAnswer}
      isCorrect={isCorrect}
      canSubmit={placed.length > 0}
    >
      <p className="mb-6 text-lg font-semibold text-gray-900">
        {exercise.prompt.text}
      </p>

      {/* Answer area */}
      <div className="mb-6 min-h-[52px] rounded-xl border-2 border-dashed border-gray-300 p-3">
        {placed.length === 0 ? (
          <span className="text-sm text-gray-400">
            Tap words below to build your answer
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placed.map((wordIndex, posIndex) => (
              <button
                key={posIndex}
                onClick={() => removeWord(posIndex)}
                className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
              >
                {words[wordIndex]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {remaining.map(({ word, i }) => (
          <button
            key={i}
            onClick={() => addWord(i)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            {word}
          </button>
        ))}
      </div>
    </ExerciseShell>
  );
}
