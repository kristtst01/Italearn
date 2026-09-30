import { useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { useLLMValidation } from '@/engine/useLLMValidation';
import { cn } from '@/lib/utils';
import ExerciseShell from './ExerciseShell';
import { Prompt, TextField } from './ui';

interface DialogueCompletionProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

/**
 * "Your line": a short exchange where the learner writes one of the turns. Replies are open
 * (any name or city that fits), so the AI check judges them against the model answer.
 */
export default function DialogueCompletion({ exercise, onComplete }: DialogueCompletionProps) {
  const [answer, setAnswer] = useState('');
  const { isCorrect, feedback, canSubmit, onBeforeSubmit } = useLLMValidation(answer, exercise.correct_answer, exercise);
  const lines = exercise.dialogue ?? [];

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
      {(submitted) => (
        <>
          <Prompt instruction="Your line">{exercise.prompt.text}</Prompt>
          <div className="flex flex-col gap-3">
            {lines.map((line, i) => {
              const mine = line.text === undefined;
              return (
                <div key={i} className={cn('flex max-w-[80%] flex-col gap-1', mine ? 'self-end items-end' : 'self-start')}>
                  <span className="text-xs font-bold uppercase tracking-label text-muted-foreground">{line.speaker}</span>
                  {mine ? (
                    <TextField
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Your reply…"
                      autoFocus
                      disabled={submitted}
                      className="min-w-96"
                    />
                  ) : (
                    <p className="rounded-lg border border-border bg-white px-4.5 py-3 text-lg">{line.text}</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </ExerciseShell>
  );
}
