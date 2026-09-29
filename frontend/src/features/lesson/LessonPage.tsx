import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findLesson } from '@/engine/lessonRunner';
import type { Lesson } from '@/types';
import EmptyState from '@/shared/components/EmptyState';
import LoadingScreen from '@/shared/components/LoadingScreen';
import renderExercise from '@/features/exercises/renderExercise';
import { useLessonState } from './useLessonState';
import LessonHeader from './LessonHeader';
import CompletionScreen from './CompletionScreen';
import GrammarTip from './GrammarTip';
import { getChapter, isWritingLesson, stampEarned } from '@/engine/chapters';
import { useProgressStore } from '@/stores/progressStore';
import SessionLayout from '@/shared/components/SessionLayout';
import { toSegments } from '@/shared/utils/segments';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | undefined | null>(() => id ? null : undefined);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    findLesson(id).then((result) => {
      if (!cancelled) setLesson(result);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (lesson === null) {
    return <LoadingScreen />;
  }

  if (!lesson) {
    return (
      <EmptyState
        title="Lesson not found"
        message={`No lesson with ID "${id}" exists.`}
      />
    );
  }

  if (lesson.exercises.length === 0) {
    return (
      <EmptyState
        title="No exercises"
        message="This lesson doesn't have any exercises yet."
      />
    );
  }

  return <LessonContent lesson={lesson} onExit={() => navigate('/')} />;
}

function LessonContent({
  lesson,
  onExit,
}: {
  lesson: Lesson;
  onExit: () => void;
}) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const state = useLessonState(lesson);

  const chapter = getChapter(lesson.unit_id);
  const meta = chapter?.lessons.find((l) => l.id === lesson.id);
  const earnsStamp = !!chapter && !!meta && isWritingLesson(meta) && !state.isRetry;
  const completed = useProgressStore((s) => s.lessons_completed);

  return (
    <SessionLayout
      header={
      <LessonHeader
        context={chapter ? `Chapter ${String(chapter.order).padStart(2, '0')} · ${chapter.name}` : undefined}
        title={lesson.name}
        segments={toSegments(state.results, state.exercises.length)}
        stamp={chapter ? { earned: stampEarned(chapter, completed) } : undefined}
        exercisesDone={state.exercisesDone}
        totalExercises={state.exercises.length}
        isComplete={state.isComplete}
        showExitConfirm={showExitConfirm}
        onToggleExit={() => setShowExitConfirm(!showExitConfirm)}
        onExit={onExit}
      />
      }
    >
        {state.isComplete && state.lessonResult ? (
          <CompletionScreen
            result={state.lessonResult}
            lessonName={lesson.name}
            isRetry={state.isRetry}
            hasMistakes={state.lessonResult.score < state.lessonResult.total}
            stamp={earnsStamp ? { title: chapter.stamp_title ?? chapter.name, caption: `A1 · ${chapter.name}` } : undefined}
            onPracticeMistakes={state.handlePracticeMistakes}
            onContinue={onExit}
          />
        ) : state.currentStep?.kind === 'tip' ? (
          <GrammarTip
            key={state.currentStep.tip.id}
            tip={state.currentStep.tip}
            onDismiss={state.handleTipDismiss}
          />
        ) : state.currentStep?.kind === 'exercise' ? (
          renderExercise({
            exercise: state.currentStep.exercise,
            onComplete: state.handleExerciseComplete,
          })
        ) : null}
    </SessionLayout>
  );
}
