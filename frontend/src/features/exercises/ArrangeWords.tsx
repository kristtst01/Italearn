import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { shuffle } from '@/shared/utils/shuffle';
import { getCorrectAnswer } from '@/shared/utils/exercise';
import HighlightedText from '@/shared/components/HighlightedText';
import ExerciseShell from './ExerciseShell';

interface ArrangeWordsProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

function normalizeForCompare(s: string): string {
  return s.trim().toLowerCase().replace(/[.,?!]+$/, '');
}

export default function ArrangeWords({
  exercise,
  onComplete,
}: ArrangeWordsProps) {
  const correctAnswer = getCorrectAnswer(exercise);

  // Include distractors in the word bank so it's not trivially easy
  const words = useMemo(
    () => shuffle([...correctAnswer.split(' '), ...exercise.distractors]),
    [correctAnswer, exercise.distractors],
  );

  const [placed, setPlaced] = useState<number[]>([]);

  const remaining = words
    .map((word, i) => ({ word, i }))
    .filter(({ i }) => !placed.includes(i));

  const userAnswer = placed.map((i) => words[i]).join(' ');
  const isCorrect =
    normalizeForCompare(userAnswer) === normalizeForCompare(correctAnswer);

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
        <HighlightedText text={exercise.prompt.text ?? ''} words={exercise.target_words} />
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
