import type { Exercise } from '@/types';
import HighlightedText from '@/shared/components/HighlightedText';
import { Correction } from '@/shared/components/design';
import { buttonVariants } from '@/components/ui/button';
import { ActionBar } from './ui';

interface FeedbackProps {
  correct: boolean;
  correctAnswer: string;
  userAnswer: string;
  exercise: Exercise;
  /** Optional validation feedback (accent reminders, typo hints) */
  feedback?: string;
  onContinue: () => void;
}

/** Shown in the bottom bar after answering: result, red-pen correction, the full sentence. */
export default function Feedback({ correct, correctAnswer, userAnswer, exercise, feedback, onContinue }: FeedbackProps) {
  const showCorrection = !correct && exercise.subtype !== 'match_pairs';

  return (
    <ActionBar tone={correct ? 'learned' : 'correction'}>
      <div className="flex min-w-0 flex-col gap-2">
        <p className={`font-display text-xl ${correct ? 'text-learned' : 'text-correction'}`}>
          {correct ? 'Giusto!' : 'Not quite'}
        </p>
        {showCorrection && <Correction wrong={userAnswer || undefined} right={correctAnswer} />}
        {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
        {exercise.sentence_context && (
          <p className="text-base italic text-foreground/80">
            <HighlightedText
              text={exercise.sentence_context.replace('___', correctAnswer)}
              words={exercise.target_words}
            />
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onContinue}
        className={buttonVariants({
          size: 'xl',
          className: `min-w-40 shrink-0 ${correct ? 'bg-learned hover:bg-learned/90' : ''}`,
        })}
      >
        Continue
      </button>
    </ActionBar>
  );
}
