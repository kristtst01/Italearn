import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { shuffle } from '@/shared/utils/shuffle';
import ExerciseShell from './ExerciseShell';
import { Choice, Prompt } from './ui';

const PAIR_SEPARATOR = '|';

/** Each matched pair gets its own tint, all from design tokens. */
const MATCH_TONES = [
  'border-cobalto bg-cobalto/10',
  'border-learned bg-learned/10',
  'border-ocra bg-ocra/15',
  'border-vermiglione bg-vermiglione/10',
  'border-foreground bg-foreground/5',
  'border-muted-foreground bg-muted-foreground/10',
];

interface MatchPairsProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function MatchPairs({ exercise, onComplete }: MatchPairsProps) {
  const pairs = useMemo(() => {
    const answers = Array.isArray(exercise.correct_answer)
      ? exercise.correct_answer
      : [exercise.correct_answer];
    return answers.map((pair) => {
      const sepIdx = pair.indexOf(PAIR_SEPARATOR);
      return {
        left: pair.slice(0, sepIdx),
        right: pair.slice(sepIdx + 1),
      };
    });
  }, [exercise.correct_answer]);

  const leftItems = pairs.map((p) => p.left);
  const rightItems = useMemo(
    () => shuffle(pairs.map((p) => p.right)),
    [pairs],
  );

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matches, setMatches] = useState<[number, number][]>([]);

  const matchedLeftSet = new Set(matches.map(([l]) => l));
  const matchedRightSet = new Set(matches.map(([, r]) => r));

  function getMatchIndex(leftIdx: number): number {
    return matches.findIndex(([l]) => l === leftIdx);
  }

  function getMatchIndexByRight(rightIdx: number): number {
    return matches.findIndex(([, r]) => r === rightIdx);
  }

  function createMatch(left: number, right: number) {
    setMatches((prev) => [...prev, [left, right]]);
    setSelectedLeft(null);
    setSelectedRight(null);
  }

  function handleLeftClick(idx: number) {
    if (matchedLeftSet.has(idx)) {
      setMatches((prev) => prev.filter(([l]) => l !== idx));
      setSelectedLeft(idx);
      return;
    }
    if (selectedLeft === idx) {
      setSelectedLeft(null);
      return;
    }
    if (selectedRight !== null) {
      createMatch(idx, selectedRight);
    } else {
      setSelectedLeft(idx);
    }
  }

  function handleRightClick(idx: number) {
    if (matchedRightSet.has(idx)) {
      setMatches((prev) => prev.filter(([, r]) => r !== idx));
      setSelectedRight(idx);
      return;
    }
    if (selectedRight === idx) {
      setSelectedRight(null);
      return;
    }
    if (selectedLeft !== null) {
      createMatch(selectedLeft, idx);
    } else {
      setSelectedRight(idx);
    }
  }

  const allMatched = matches.length === pairs.length;
  const isCorrect =
    allMatched &&
    matches.every(([l, r]) => rightItems[r] === pairs[l].right);

  const userAnswer = matches
    .map(([l, r]) => `${leftItems[l]}→${rightItems[r]}`)
    .join(', ');

  const feedback =
    allMatched && !isCorrect
      ? `Correct pairs: ${pairs.map((p) => `${p.left} → ${p.right}`).join(', ')}`
      : undefined;

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={userAnswer}
      isCorrect={isCorrect}
      canSubmit={allMatched}
      feedback={feedback}
    >
      <Prompt>{exercise.prompt.text}</Prompt>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {/* Left column */}
        <div className="flex flex-col gap-2.5">
          {leftItems.map((item, idx) => {
            const matchIdx = getMatchIndex(idx);
            const tone = matchIdx !== -1 ? MATCH_TONES[matchIdx % MATCH_TONES.length] : undefined;

            return (
              <Choice key={idx} tone={tone} selected={selectedLeft === idx} onClick={() => handleLeftClick(idx)}>
                {item}
              </Choice>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2.5">
          {rightItems.map((item, idx) => {
            const matchIdx = getMatchIndexByRight(idx);
            const tone = matchIdx !== -1 ? MATCH_TONES[matchIdx % MATCH_TONES.length] : undefined;

            return (
              <Choice key={idx} tone={tone} selected={selectedRight === idx} onClick={() => handleRightClick(idx)}>
                {item}
              </Choice>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
}
