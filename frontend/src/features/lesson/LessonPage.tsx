import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { findLesson } from '@/engine/lessonRunner';
import type { Lesson } from '@/types';
import EmptyState from '@/shared/components/EmptyState';
import LoadingScreen from '@/shared/components/LoadingScreen';
import renderExercise from '@/features/exercises/renderExercise';
import { useLessonState } from './useLessonState';
import LessonHeader from './LessonHeader';
import CompletionScreen from './CompletionScreen';
import GrammarTip from './GrammarTip';
import NewWords from './NewWords';
import ReadingPanel from './ReadingPanel';
import { getChapter, isWritingLesson, stampEarned } from '@/engine/chapters';
import { useProgressStore } from '@/stores/progressStore';
import SessionLayout from '@/shared/components/SessionLayout';
import { toSegments } from '@/shared/utils/segments';
import { useGoBack } from '@/shared/utils/useGoBack';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  // Back to where the lesson was opened from; the lesson's chapter if opened directly
  const goBack = useGoBack(id ? `/library/${id.replace(/-lesson-\d+$/, '')}` : '/library');
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

  return <LessonContent lesson={lesson} onExit={goBack} />;
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
  const completed = useProgressStore((s) => s.lessons_completed);
  // The stamp comes with the chapter's last writing lesson: this one, once all the others are done
  const earnsStamp =
    !!chapter &&
    !!meta &&
    isWritingLesson(meta) &&
    !state.isRetry &&
    chapter.lessons.filter(isWritingLesson).every((l) => l.id === lesson.id || completed.includes(l.id));

  const step =
    state.currentStep?.kind === 'words' ? (
      <NewWords words={state.currentStep.words} onStart={state.handleTipDismiss} />
    ) : state.currentStep?.kind === 'tip' ? (
      <GrammarTip key={state.currentStep.tip.id} tip={state.currentStep.tip} onDismiss={state.handleTipDismiss} />
    ) : state.currentStep?.kind === 'exercise' ? (
      renderExercise({ exercise: state.currentStep.exercise, onComplete: state.handleExerciseComplete })
    ) : null;
  // Reading lessons keep the text beside every question
  const reading = lesson.reading && !state.isComplete;

  return (
    <SessionLayout
      wide={!!reading}
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
        ) : reading && lesson.reading ? (
          // The text column is as wide as its line length allows; the question takes a slim column beside it
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,auto)_var(--container-aside)] lg:justify-center">
            <ReadingPanel text={lesson.reading} />
            <div className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">{step}</div>
          </div>
        ) : (
          step
        )}
    </SessionLayout>
  );
}
