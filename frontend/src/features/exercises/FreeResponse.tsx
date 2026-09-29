import { useCallback, useEffect, useRef, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { gradeFreeResponse } from '@/engine/api';
import { buildCurriculumContext } from '@/engine/curriculumContext';
import { useProgressStore } from '@/stores/progressStore';
import { getFirstCorrectAnswer } from '@/shared/utils/exercise';
import HighlightedText from '@/shared/components/HighlightedText';
import { ActionButton, ActionRow, FeedbackCard, Prompt } from './ui';

interface FreeResponseProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

const MAX_CHARS = 5000;

export default function FreeResponse({ exercise, onComplete }: FreeResponseProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<{ accepted: boolean; feedback: string } | null>(null);
  const [error, setError] = useState(false);
  const startTime = useRef(Date.now());
  const lessonsCompleted = useProgressStore((s) => s.lessons_completed);

  const charsLeft = MAX_CHARS - answer.length;
  const canSubmit = answer.trim().length > 0 && charsLeft >= 0 && !grading;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setGrading(true);
    setError(false);

    try {
      const gradeResult = await gradeFreeResponse({
        prompt: exercise.prompt.text ?? '',
        correct_answer: getFirstCorrectAnswer(exercise),
        user_answer: answer,
        curriculum_context: buildCurriculumContext(lessonsCompleted),
      });
      setResult(gradeResult);
    } catch {
      setError(true);
      // On API failure, accept the answer — don't block progress
      setResult({ accepted: true, feedback: 'Could not grade your response, but keep going!' });
    }

    setGrading(false);
    setSubmitted(true);
  }, [canSubmit, answer, exercise, lessonsCompleted]);

  function handleContinue() {
    onComplete({
      exercise_id: exercise.id,
      correct: result?.accepted ?? true,
      user_answer: answer,
      time_spent_ms: Date.now() - startTime.current,
    });
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Enter submits (but not inside textarea — use Ctrl/Cmd+Enter there)
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!submitted && canSubmit) {
          handleSubmit();
        } else if (submitted) {
          handleContinue();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submitted, canSubmit, handleSubmit],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col gap-6">
      <Prompt>
        <HighlightedText text={exercise.prompt.text ?? ''} words={exercise.target_words} />
      </Prompt>

      {exercise.hints.length > 0 && <p className="-mt-2 text-sm text-muted-foreground">{exercise.hints[0]}</p>}

      <div className="flex flex-col gap-1.5">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Write your answer in Italian…"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          rows={6}
          disabled={submitted}
          className="w-full resize-none rounded-lg border-2 border-border bg-white px-4.5 py-3.5 text-reading outline-none transition-colors focus:border-cobalto disabled:text-muted-foreground"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Ctrl+Enter to submit</span>
          <span className={charsLeft < 100 ? 'text-correction' : ''}>{charsLeft.toLocaleString()} characters left</span>
        </div>
      </div>

      {!submitted ? (
        <ActionRow>
          <span className="text-sm text-muted-foreground">Graded by AI against what you've learned so far</span>
          <ActionButton onClick={handleSubmit} disabled={!canSubmit}>
            {grading ? 'Grading…' : 'Submit'}
          </ActionButton>
        </ActionRow>
      ) : (
        result && (
          <FeedbackCard
            tone={result.accepted ? 'learned' : 'in-progress'}
            action={
              <ActionButton tone={result.accepted ? 'learned' : 'primary'} onClick={handleContinue}>
                Continue
              </ActionButton>
            }
          >
            <p className={`font-display text-2xl ${result.accepted ? 'text-learned' : 'text-foreground'}`}>
              {result.accepted ? 'Bravo!' : 'Keep practising'}
            </p>
            <p className="text-sm">{result.feedback}</p>
            {error && (
              <p className="text-xs italic text-muted-foreground">
                (Grading service unavailable, so your answer was accepted automatically)
              </p>
            )}
          </FeedbackCard>
        )
      )}
    </div>
  );
}
