import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ExerciseResult } from '@/types';
import {
  findLesson,
  buildLessonResult,
  type LessonResult,
} from '@/engine/lessonRunner';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { db } from '@/stores/db';
import MultipleChoice from '@/components/exercises/MultipleChoice';
import TypeAnswer from '@/components/exercises/TypeAnswer';
import ArrangeWords from '@/components/exercises/ArrangeWords';

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = id ? findLesson(id) : undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [startTime] = useState(() => Date.now());

  const completeLesson = useProgressStore((s) => s.completeLesson);
  const addCards = useSrsStore((s) => s.addCards);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Lesson not found
          </h1>
          <p className="text-gray-500 mb-4">
            No lesson with ID &ldquo;{id}&rdquo; exists.
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Back to path
          </button>
        </div>
      </div>
    );
  }

  if (lesson.exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No exercises
          </h1>
          <p className="text-gray-500 mb-4">
            This lesson doesn&apos;t have any exercises yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Back to path
          </button>
        </div>
      </div>
    );
  }

  const exercises = lesson.exercises;
  const currentExercise = exercises[currentIndex];
  const isComplete = !!lessonResult;
  const progress =
    ((currentIndex + (isComplete ? 1 : 0)) / exercises.length) * 100;

  function handleExerciseComplete(result: ExerciseResult) {
    const updatedResults = [...results, result];
    setResults(updatedResults);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= exercises.length) {
      handleLessonComplete(updatedResults);
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  async function handleLessonComplete(finalResults: ExerciseResult[]) {
    const result = buildLessonResult(
      lesson!.id,
      exercises,
      finalResults,
      startTime,
    );
    setLessonResult(result);

    await completeLesson(lesson!.id);

    const cardsToCreate: { wordId: string; skillType: 'vocab' | 'writing' }[] =
      [];
    for (const word of result.wordsEncountered) {
      for (const skillType of ['vocab', 'writing'] as const) {
        const existing = await db.srsCards
          .where('[word_id+skill_type]')
          .equals([word, skillType])
          .first();
        if (!existing) {
          cardsToCreate.push({ wordId: word, skillType });
        }
      }
    }
    if (cardsToCreate.length > 0) {
      await addCards(cardsToCreate);
    }
  }

  function renderExercise() {
    if (!currentExercise) return null;
    const props = {
      key: currentExercise.id,
      exercise: currentExercise,
      onComplete: handleExerciseComplete,
    };
    switch (currentExercise.subtype) {
      case 'multiple_choice':
        return <MultipleChoice {...props} />;
      case 'type_answer':
        return <TypeAnswer {...props} />;
      case 'arrange_words':
        return <ArrangeWords {...props} />;
      default:
        return (
          <div className="text-gray-500">
            Exercise type &ldquo;{currentExercise.subtype}&rdquo; is not yet
            supported.
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <ExitButton
            showConfirm={showExitConfirm}
            onToggle={() => setShowExitConfirm(!showExitConfirm)}
            onExit={() => navigate('/')}
            inProgress={!isComplete}
          />
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {Math.min(currentIndex + 1, exercises.length)}/{exercises.length}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto p-6">
        {isComplete && lessonResult ? (
          <CompletionScreen
            result={lessonResult}
            lessonName={lesson.name}
            onContinue={() => navigate('/')}
          />
        ) : (
          renderExercise()
        )}
      </div>
    </div>
  );
}

function CompletionScreen({
  result,
  lessonName,
  onContinue,
}: {
  result: LessonResult;
  lessonName: string;
  onContinue: () => void;
}) {
  const pct = Math.round((result.score / result.total) * 100);
  const minutes = Math.floor(result.timeMs / 60000);
  const seconds = Math.floor((result.timeMs % 60000) / 1000);

  return (
    <div className="text-center space-y-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Lesson Complete!</h1>
      <p className="text-gray-600">{lessonName}</p>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-4">
        <div>
          <p className="text-5xl font-bold text-blue-600">{pct}%</p>
          <p className="text-gray-500 mt-1">
            {result.score}/{result.total} correct
          </p>
        </div>
        <div className="text-gray-500 text-sm">
          Time: {minutes > 0 ? `${minutes}m ` : ''}
          {seconds}s
        </div>
        <div className="text-gray-500 text-sm">
          {result.wordsEncountered.length} words practiced
        </div>
      </div>

      <button
        onClick={onContinue}
        autoFocus
        className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Back to path
      </button>
    </div>
  );
}

function ExitButton({
  showConfirm,
  onToggle,
  onExit,
  inProgress,
}: {
  showConfirm: boolean;
  onToggle: () => void;
  onExit: () => void;
  inProgress: boolean;
}) {
  if (!inProgress) {
    return (
      <button
        onClick={onExit}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Exit lesson"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Exit lesson"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {showConfirm && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
          <p className="text-sm text-gray-700 mb-3">
            Exit lesson? Progress will be lost.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onExit}
              className="flex-1 px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Exit
            </button>
            <button
              onClick={onToggle}
              className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
