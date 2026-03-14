import { useMemo, useState } from 'react';
import type { Exercise, ExerciseResult } from '@/types';
import { shuffle } from '@/shared/utils/shuffle';
import ExerciseShell from './ExerciseShell';

const PAIR_SEPARATOR = '|';

const MATCH_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
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
      <p className="mb-6 text-lg font-semibold text-gray-900">
        {exercise.prompt.text}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
        <div className="space-y-2">
          {leftItems.map((item, idx) => {
            const matchIdx = getMatchIndex(idx);
            const color =
              matchIdx !== -1
                ? MATCH_COLORS[matchIdx % MATCH_COLORS.length]
                : null;
            const isSelected = selectedLeft === idx;

            return (
              <button
                key={idx}
                onClick={() => handleLeftClick(idx)}
                className={`w-full rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  color
                    ? `${color.bg} ${color.text} ${color.border}`
                    : isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {rightItems.map((item, idx) => {
            const matchIdx = getMatchIndexByRight(idx);
            const color =
              matchIdx !== -1
                ? MATCH_COLORS[matchIdx % MATCH_COLORS.length]
                : null;
            const isSelected = selectedRight === idx;

            return (
              <button
                key={idx}
                onClick={() => handleRightClick(idx)}
                className={`w-full rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  color
                    ? `${color.bg} ${color.text} ${color.border}`
                    : isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
}
