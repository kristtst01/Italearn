import { useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { useLLMValidation } from '@/engine/useLLMValidation';
import ExerciseShell from './ExerciseShell';
import { ExercisePrompt, TextField } from './ui';

interface TypeAnswerProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function TypeAnswer({
  exercise,
  onComplete,
}: TypeAnswerProps) {
  const [answer, setAnswer] = useState('');

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
      canSubmit={canSubmit}
      feedback={feedback}
      onBeforeSubmit={onBeforeSubmit}
    >
      <ExercisePrompt exercise={exercise} />

      <TextField
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer…"
        autoFocus
      />
    </ExerciseShell>
  );
}
