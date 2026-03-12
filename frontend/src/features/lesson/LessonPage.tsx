import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findLesson } from '@/engine/lessonRunner';
import EmptyState from '@/shared/components/EmptyState';
import renderExercise from '@/features/exercises/renderExercise';
import { useLessonState } from './useLessonState';
import LessonHeader from './LessonHeader';
import CompletionScreen from './CompletionScreen';
import GrammarTip from './GrammarTip';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = id ? findLesson(id) : undefined;

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
  lesson: ReturnType<typeof findLesson> & {};
  onExit: () => void;
}) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const state = useLessonState(lesson);

  return (
    <div className="min-h-screen bg-gray-50">
      <LessonHeader
        progress={state.progress}
        exercisesDone={state.exercisesDone}
        totalExercises={state.exercises.length}
        isComplete={state.isComplete}
        showExitConfirm={showExitConfirm}
        onToggleExit={() => setShowExitConfirm(!showExitConfirm)}
        onExit={onExit}
      />

      <div className="max-w-2xl mx-auto p-6">
        {state.isComplete && state.lessonResult ? (
          <CompletionScreen
            result={state.lessonResult}
            lessonName={lesson.name}
            isRetry={state.isRetry}
            hasMistakes={state.lessonResult.score < state.lessonResult.total}
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
      </div>
    </div>
  );
}
