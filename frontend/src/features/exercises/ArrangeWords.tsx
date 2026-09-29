import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { shuffle } from '@/shared/utils/shuffle';
import { getCorrectAnswer } from '@/shared/utils/exercise';
import { useLLMValidation } from '@/engine/useLLMValidation';
import HighlightedText from '@/shared/components/HighlightedText';
import ExerciseShell from './ExerciseShell';
import { Chip, Prompt } from './ui';

interface ArrangeWordsProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
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

  const { isCorrect, feedback, onBeforeSubmit } = useLLMValidation(
    userAnswer,
    correctAnswer,
    exercise,
  );

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
      feedback={feedback}
      onBeforeSubmit={onBeforeSubmit}
    >
      <Prompt>
        <HighlightedText text={exercise.prompt.text ?? ''} words={exercise.target_words} />
      </Prompt>

      {/* Answer line */}
      <div className="flex min-h-16 flex-wrap items-center gap-2 border-b-2 border-foreground pb-3">
        {placed.length === 0 ? (
          <span className="text-sm text-muted-foreground">Click the words below to build your answer</span>
        ) : (
          placed.map((wordIndex, posIndex) => (
            <Chip key={posIndex} active onClick={() => removeWord(posIndex)}>
              {words[wordIndex]}
            </Chip>
          ))
        )}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {remaining.map(({ word, i }) => (
          <Chip key={i} onClick={() => addWord(i)}>
            {word}
          </Chip>
        ))}
      </div>
    </ExerciseShell>
  );
}
