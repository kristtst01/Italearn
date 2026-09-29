import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { shuffle } from '@/shared/utils/shuffle';
import { getFirstCorrectAnswer } from '@/shared/utils/exercise';
import HighlightedText from '@/shared/components/HighlightedText';
import ExerciseShell from './ExerciseShell';
import { Choice, Prompt } from './ui';

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
      <Prompt>
        <HighlightedText text={exercise.prompt.text ?? ''} words={exercise.target_words} />
      </Prompt>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <Choice key={option} selected={selected === option} onClick={() => setSelected(option)}>
            {option}
          </Choice>
        ))}
      </div>
    </ExerciseShell>
  );
}
