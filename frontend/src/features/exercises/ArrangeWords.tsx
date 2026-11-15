import { useEffect, useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { shuffle } from '@/shared/utils/shuffle';
import { getCorrectAnswer } from '@/shared/utils/exercise';
import { useLLMValidation } from '@/engine/useLLMValidation';
import { cn } from '@/lib/utils';
import ExerciseShell from './ExerciseShell';
import { Chip, ExercisePrompt } from './ui';

interface ArrangeWordsProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

/** What typing matches against: lower case, no accents, no punctuation except apostrophes (l'aeroporto). */
function matchKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}']/gu, '');
}

/** Listens for keys on the page while mounted (re-subscribed each render, so it sees current state). */
function KeyListener({ onKey }: { onKey: (e: KeyboardEvent) => void }) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Leave typing in real fields alone (e.g. the feedback panel)
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      onKey(e);
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });
  return null;
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
  // Letters typed towards the next word (keyboard alternative to clicking)
  const [typed, setTyped] = useState('');

  const remaining = words
    .map((word, i) => ({ word, i }))
    .filter(({ i }) => !placed.includes(i));

  const typedKey = matchKey(typed);
  const matches = typedKey ? remaining.filter(({ word }) => matchKey(word).startsWith(typedKey)) : [];
  const highlighted = matches[0]?.i;

  const userAnswer = placed.map((i) => words[i]).join(' ');

  const { isCorrect, feedback, onBeforeSubmit } = useLLMValidation(
    userAnswer,
    correctAnswer,
    exercise,
  );

  function addWord(index: number) {
    setPlaced((prev) => [...prev, index]);
    setTyped('');
  }

  function removeWord(positionIndex: number) {
    setPlaced((prev) => prev.filter((_, i) => i !== positionIndex));
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === ' ') {
      if (highlighted === undefined) return;
      e.preventDefault();
      addWord(highlighted);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (typed) setTyped((t) => t.slice(0, -1));
      else setPlaced((prev) => prev.slice(0, -1));
    } else if (e.key === 'Escape') {
      setTyped('');
    } else if (e.key.length === 1) {
      const next = typed + e.key;
      const key = matchKey(next);
      if (!key) return;
      e.preventDefault();
      // A whole word that only one tile can be goes in straight away; otherwise wait for Space
      const candidates = remaining.filter(({ word }) => matchKey(word).startsWith(key));
      if (candidates.length === 1 && matchKey(candidates[0].word) === key) addWord(candidates[0].i);
      else setTyped(next);
    }
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
      {(submitted) => (
        <>
          {!submitted && <KeyListener onKey={onKey} />}
          <ExercisePrompt exercise={exercise} />

          {/* Answer line */}
          <div className="flex min-h-16 flex-wrap items-center gap-2 border-b-2 border-foreground pb-3">
            {placed.length === 0 && !typed ? (
              <span className="text-sm text-muted-foreground">
                Click the words below to build your answer
                <span className="pointer-coarse:hidden">, or type them</span>
              </span>
            ) : (
              placed.map((wordIndex, posIndex) => (
                <Chip key={posIndex} active onClick={() => removeWord(posIndex)}>
                  {words[wordIndex]}
                </Chip>
              ))
            )}
            {typed && (
              <span
                className={cn(
                  'rounded-lg border-2 border-dashed px-3.5 py-2 text-base font-medium',
                  highlighted === undefined ? 'border-correction text-correction' : 'border-muted-foreground/50 text-muted-foreground',
                )}
              >
                {typed}
              </span>
            )}
          </div>

          {/* Word bank */}
          <div className="flex flex-wrap gap-2">
            {remaining.map(({ word, i }) => (
              <Chip key={i} onClick={() => addWord(i)} className={cn(i === highlighted && 'border-cobalto')}>
                {word}
              </Chip>
            ))}
          </div>
          {!submitted && (
            <p className="-mt-3 text-xs text-muted-foreground max-sm:hidden pointer-coarse:hidden">
              Type a word and press Space to place it · Backspace takes the last word back
            </p>
          )}
        </>
      )}
    </ExerciseShell>
  );
}
