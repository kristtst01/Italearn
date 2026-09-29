import { useEffect, useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { shuffle } from '@/shared/utils/shuffle';
import { getFirstCorrectAnswer } from '@/shared/utils/exercise';
import ExerciseShell from './ExerciseShell';
import { Choice, ExercisePrompt, type ChoiceState } from './ui';

interface MultipleChoiceProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function MultipleChoice({ exercise, onComplete }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const correctAnswer = getFirstCorrectAnswer(exercise);

  const options = useMemo(
    () => shuffle([correctAnswer, ...exercise.distractors]),
    [correctAnswer, exercise.distractors],
  );

  // Number keys 1–4 pick an answer
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (locked) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) setSelected(options[n - 1]);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [locked, options]);

  function stateFor(option: string, submitted: boolean): ChoiceState {
    if (!submitted) return selected === option ? 'selected' : 'idle';
    if (option === correctAnswer) return 'correct';
    return option === selected ? 'wrong' : 'idle';
  }

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={selected ?? ''}
      isCorrect={selected === correctAnswer}
      canSubmit={selected !== null}
      onSubmitted={() => setLocked(true)}
    >
      {(submitted) => (
          <>
            <ExercisePrompt exercise={exercise} showContext />
            <div className="grid grid-cols-2 gap-3">
              {options.map((option, i) => (
                <Choice
                  key={option}
                  keyLabel={String(i + 1)}
                  state={stateFor(option, submitted)}
                  disabled={submitted}
                  onClick={() => setSelected(option)}
                >
                  {option}
                </Choice>
              ))}
            </div>
          </>
      )}
    </ExerciseShell>
  );
}
