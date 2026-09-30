import { useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { useLLMValidation } from '@/engine/useLLMValidation';
import ExerciseShell from './ExerciseShell';
import { Prompt, TextField } from './ui';

interface RewriteSentenceProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

/**
 * A whole sentence to rewrite: `transformation` (for another person, negative, question…)
 * or `find_mistake`, where the answer box starts with the faulty sentence to edit.
 * `correct_answer` lists every accepted version, the model answer first.
 */
export default function RewriteSentence({ exercise, onComplete }: RewriteSentenceProps) {
  const fixing = exercise.subtype === 'find_mistake';
  const [answer, setAnswer] = useState(fixing ? exercise.sentence_context : '');

  const { isCorrect, feedback, canSubmit, onBeforeSubmit } = useLLMValidation(
    answer,
    exercise.correct_answer,
    exercise,
  );

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={answer}
      isCorrect={isCorrect}
      canSubmit={canSubmit && (!fixing || answer.trim() !== exercise.sentence_context.trim())}
      feedback={feedback}
      onBeforeSubmit={onBeforeSubmit}
    >
      <Prompt instruction={exercise.prompt.text}>
        <span className="font-display text-4xl leading-tight tracking-tight">{exercise.sentence_context}</span>
      </Prompt>

      <TextField
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={fixing ? undefined : 'Write the new sentence…'}
        autoFocus
        onFocus={(e) => fixing && e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
      />
    </ExerciseShell>
  );
}
