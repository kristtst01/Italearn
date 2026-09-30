import type { Exercise } from '@/types';
import HighlightedText from '@/shared/components/HighlightedText';
import { Correction } from '@/shared/components/design';
import { ActionButton, FeedbackCard } from './ui';

interface FeedbackProps {
  correct: boolean;
  correctAnswer: string;
  userAnswer: string;
  exercise: Exercise;
  /** Optional validation feedback (accent reminders, typo hints) */
  feedback?: string;
  onContinue: () => void;
}

/** Shown in place of the Check row after answering. */
export default function Feedback({ correct, correctAnswer, userAnswer, exercise, feedback, onContinue }: FeedbackProps) {
  // Multiple choice and match pairs show right/wrong in the answers themselves
  const showCorrection = !correct && !['match_pairs', 'multiple_choice'].includes(exercise.subtype);
  const hint = !correct ? exercise.hints[0] : undefined;
  // The full sentence, with the blank filled by your answer if it was right. Rewrite exercises
  // show the sentence you started from (for find_mistake, the faulty one), so it isn't repeated.
  const rewrite = ['transformation', 'find_mistake'].includes(exercise.subtype);
  let filled = correct && userAnswer.trim() ? userAnswer.trim() : correctAnswer;
  if (exercise.sentence_context?.startsWith('___')) filled = filled.charAt(0).toUpperCase() + filled.slice(1);
  const sentence = rewrite ? undefined : exercise.sentence_context?.replace('___', filled);

  return (
    <FeedbackCard
      tone={correct ? 'learned' : 'correction'}
      action={
        <ActionButton tone={correct ? 'learned' : 'primary'} onClick={onContinue}>
          Continue
        </ActionButton>
      }
    >
      <p className={`font-display text-2xl ${correct ? 'text-learned' : 'text-correction'}`}>
        {correct ? 'Giusto!' : 'Not quite'}
      </p>
      {showCorrection && <Correction wrong={userAnswer || undefined} right={correctAnswer} />}
      {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
      {hint && exercise.subtype !== 'cloze' && <p className="max-w-lg text-sm text-muted-foreground">{hint}</p>}
      {sentence && (
        <p className="text-lg italic">
          <HighlightedText text={sentence} words={exercise.target_words} />
        </p>
      )}
    </FeedbackCard>
  );
}
