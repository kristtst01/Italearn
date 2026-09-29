import type { Exercise, ExerciseResult } from '@/types';
import { Placeholder } from '@/shared/components/design';
import { buttonVariants } from '@/components/ui/button';
import { ActionBar, Prompt } from './ui';
import { PLANNED_EXERCISES } from './plannedExercises';

interface PlannedExerciseCardProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

/** Stand-in for an exercise type that isn't built yet. Continuing counts as a skip. */
export default function PlannedExerciseCard({ exercise, onComplete }: PlannedExerciseCardProps) {
  const planned = PLANNED_EXERCISES[exercise.subtype];
  const name = planned?.name ?? exercise.subtype;

  return (
    <div className="flex flex-col gap-8 pb-44">
      <Prompt instruction={name}>{exercise.prompt.text}</Prompt>
      <Placeholder title={`${name}: ${planned?.trains ?? 'coming soon'}`} description={planned?.description}>
        {planned && (
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Example</span>
            <span className="font-bold">{planned.example.prompt}</span>
            <span className="text-muted-foreground">→ {planned.example.answer}</span>
          </div>
        )}
      </Placeholder>
      <ActionBar>
        <span className="text-sm text-muted-foreground">This exercise type is coming soon.</span>
        <button
          type="button"
          className={buttonVariants({ variant: 'stroke', size: 'xl', className: 'min-w-40' })}
          onClick={() =>
            onComplete({ exercise_id: exercise.id, correct: false, user_answer: '', time_spent_ms: 0, skipped: true })
          }
        >
          Continue
        </button>
      </ActionBar>
    </div>
  );
}
