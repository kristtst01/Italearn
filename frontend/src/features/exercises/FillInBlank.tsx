import { useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { useLLMValidation } from '@/engine/useLLMValidation';
import HighlightedText from '@/shared/components/HighlightedText';
import ExerciseShell from './ExerciseShell';
import { Prompt } from './ui';

interface FillInBlankProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function FillInBlank({
  exercise,
  onComplete,
}: FillInBlankProps) {
  const [answer, setAnswer] = useState('');

  const { isCorrect, feedback, canSubmit, onBeforeSubmit } = useLLMValidation(
    answer,
    exercise.correct_answer,
    exercise,
  );

  // Split sentence on the blank marker (___) to render inline input
  const parts = exercise.sentence_context.split('___');

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={answer}
      isCorrect={isCorrect}
      canSubmit={canSubmit}
      feedback={feedback}
      onBeforeSubmit={onBeforeSubmit}
    >
      <Prompt
        instruction={exercise.prompt.text && <HighlightedText text={exercise.prompt.text} words={exercise.target_words} />}
      />

      {exercise.hints.length > 0 && <p className="-mt-4 text-base italic text-muted-foreground">{exercise.hints[0]}</p>}

      <p className="min-h-[2lh] text-2xl font-bold leading-relaxed">
        {parts[0]}
        <span className="mx-1.5 inline-block min-w-28 border-b-3 border-cobalto align-baseline">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="…"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            size={Math.max(answer.length, 6)}
            className="bg-transparent text-center text-cobalto outline-none placeholder:text-muted-foreground/50"
          />
        </span>
        {parts[1]}
      </p>
    </ExerciseShell>
  );
}
