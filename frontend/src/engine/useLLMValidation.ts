import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Exercise } from '@/types';
import { validateAnswerMulti } from '@/engine/validation';
import { validateAnswer as validateAnswerApi } from '@/engine/api';

/**
 * Wraps synchronous validation with an async LLM fallback.
 *
 * Flow: exact → accent-tolerant → Levenshtein → LLM (on submit only)
 * The LLM is only called when the answer doesn't match any tier locally,
 * filtering out obvious typos so we don't waste API calls.
 */
export function useLLMValidation(
  answer: string,
  correctAnswers: string | string[],
  exercise: Exercise,
) {
  const syncResult = useMemo(
    () => validateAnswerMulti(answer, correctAnswers),
    [answer, correctAnswers],
  );

  const [llmOverride, setLlmOverride] = useState<{
    correct: boolean;
    feedback: string;
  } | null>(null);

  // Reset LLM override when the answer changes
  useEffect(() => {
    setLlmOverride(null);
  }, [answer]);

  const needsLLM = !syncResult.correct && !syncResult.almostCorrect && answer.trim().length > 0;

  const handleBeforeSubmit = useCallback(async () => {
    if (!needsLLM) return;

    const answers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];

    try {
      const result = await validateAnswerApi({
        exercise_type: exercise.subtype,
        prompt: exercise.prompt.text ?? '',
        expected_answers: answers,
        user_answer: answer,
      });

      setLlmOverride({ correct: result.accepted, feedback: result.reason });
    } catch {
      // Fail silently — fall back to sync result
    }
  }, [needsLLM, answer, correctAnswers, exercise.subtype, exercise.prompt.text]);

  return {
    isCorrect: llmOverride?.correct ?? syncResult.correct,
    feedback: llmOverride?.feedback ?? syncResult.feedback,
    canSubmit: answer.trim().length > 0,
    onBeforeSubmit: needsLLM ? handleBeforeSubmit : undefined,
  };
}
