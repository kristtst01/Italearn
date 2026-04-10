import { useCallback, useEffect, useRef, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { gradeFreeResponse } from '@/engine/api';
import { buildCurriculumContext } from '@/engine/curriculumContext';
import { useProgressStore } from '@/stores/progressStore';
import { getFirstCorrectAnswer } from '@/shared/utils/exercise';
import HighlightedText from '@/shared/components/HighlightedText';

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
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex-1">
        <p className="mb-2 text-lg font-semibold text-gray-900">
          <HighlightedText text={exercise.prompt.text ?? ''} words={exercise.target_words} />
        </p>

        {exercise.hints.length > 0 && (
          <p className="mb-4 text-sm text-gray-500">{exercise.hints[0]}</p>
        )}

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Write your answer in Italian…"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          rows={4}
          disabled={submitted}
          className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-700"
        />

        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>Press Ctrl+Enter to submit</span>
          <span className={charsLeft < 100 ? 'text-amber-500' : ''}>
            {charsLeft.toLocaleString()} chars left
          </span>
        </div>
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {grading ? 'Grading…' : 'Submit'}
        </button>
      )}

      {submitted && result && (
        <div
          className={`fixed inset-x-0 bottom-0 p-6 ${
            result.accepted
              ? 'border-t-2 border-green-400 bg-green-50'
              : 'border-t-2 border-amber-400 bg-amber-50'
          }`}
        >
          <div className="mx-auto max-w-lg">
            <div className="mb-1 flex items-center gap-2">
              {result.accepted ? (
                <>
                  <span className="text-2xl text-green-600">&#10003;</span>
                  <span className="text-lg font-bold text-green-700">Good work!</span>
                </>
              ) : (
                <>
                  <span className="text-2xl text-amber-600">&#9998;</span>
                  <span className="text-lg font-bold text-amber-700">Keep practicing</span>
                </>
              )}
            </div>

            <p className={`mb-3 text-sm ${result.accepted ? 'text-green-800' : 'text-amber-800'}`}>
              {result.feedback}
            </p>

            {error && (
              <p className="mb-3 text-xs text-gray-500 italic">
                (Grading service unavailable — your answer was accepted automatically)
              </p>
            )}

            <button
              onClick={handleContinue}
              className={`w-full rounded-xl py-3 font-semibold text-white transition-colors ${
                result.accepted
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
