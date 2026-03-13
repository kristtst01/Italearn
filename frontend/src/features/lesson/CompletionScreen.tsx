import { useMemo } from 'react';
import type { LessonResult } from '@/types';
import Confetti from '@/shared/components/Confetti';
import { calculateExerciseXP } from '@/engine/xp';

interface CompletionScreenProps {
  result: LessonResult;
  lessonName: string;
  isRetry: boolean;
  hasMistakes: boolean;
  onPracticeMistakes: () => void;
  onContinue: () => void;
}

export default function CompletionScreen({
  result,
  lessonName,
  isRetry,
  hasMistakes,
  onPracticeMistakes,
  onContinue,
}: CompletionScreenProps) {
  const pct = Math.round((result.score / result.total) * 100);
  const minutes = Math.floor(result.timeMs / 60000);
  const seconds = Math.floor((result.timeMs % 60000) / 1000);
  const isPerfect = pct === 100;

  const xpEarned = useMemo(
    () => result.results.reduce((sum, r) => sum + calculateExerciseXP(r.correct, 1), 0),
    [result.results],
  );

  return (
    <div className="text-center space-y-6 py-8">
      {!isRetry && <Confetti />}
      <div className="animate-[bounce_0.5s_ease-in-out]">
        <h1 className="text-3xl font-bold text-gray-900">
          {isRetry ? 'Retry Complete!' : isPerfect ? 'Perfect!' : 'Lesson Complete!'}
        </h1>
      </div>
      <p className="text-gray-600">{lessonName}</p>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-4">
        <div>
          <p className="text-5xl font-bold text-blue-600">{pct}%</p>
          <p className="text-gray-500 mt-1">
            {result.score}/{result.total} correct
          </p>
        </div>
        {xpEarned > 0 && (
          <p className="text-amber-600 font-semibold">+{xpEarned} XP</p>
        )}
        <div className="text-gray-500 text-sm">
          Time: {minutes > 0 ? `${minutes}m ` : ''}
          {seconds}s
        </div>
        <div className="text-gray-500 text-sm">
          {result.wordsEncountered.length} words practiced
        </div>
      </div>

      {hasMistakes && (
        <button
          onClick={onPracticeMistakes}
          autoFocus
          className="w-full px-4 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
        >
          Practice mistakes ({result.total - result.score})
        </button>
      )}

      <button
        onClick={onContinue}
        autoFocus={!hasMistakes}
        className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Back to path
      </button>
    </div>
  );
}
