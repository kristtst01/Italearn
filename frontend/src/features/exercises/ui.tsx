import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { Play } from 'lucide-react';
import type { Exercise } from '@/types';
import HighlightedText from '@/shared/components/HighlightedText';
import { Label } from '@/shared/components/design';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { splitPrompt } from './prompt';

/*
 * Shared building blocks for exercises ("Focus" design, docs/design-system.md).
 * Colours come from design tokens only.
 */

/** Disabled until audio exists (pre-generated TTS is planned). */
export function AudioButton() {
  return (
    <span
      title="Audio coming soon"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 text-muted-foreground/60"
    >
      <Play className="size-3.5" />
    </span>
  );
}

/**
 * The task. Prompts like "What does 'ciao' mean?" become a small instruction plus the
 * word as a large hero; anything else is shown as a bold sentence.
 */
export function ExercisePrompt({ exercise, showContext = false }: { exercise: Exercise; showContext?: boolean }) {
  const text = exercise.prompt.text ?? '';
  const split = splitPrompt(text);

  if (!split) {
    return (
      <p className="text-2xl font-bold leading-snug">
        <HighlightedText text={text} words={exercise.target_words} />
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{split.instruction}</Label>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="font-display text-7xl leading-none tracking-tight">{split.hero}</span>
        {showContext && exercise.sentence_context && (
          <span className="flex items-center gap-2 self-center text-base text-muted-foreground">
            <AudioButton />
            <i>{exercise.sentence_context}</i>
          </span>
        )}
      </div>
    </div>
  );
}

/** Simple prompt for exercises that lay out their own task (fill in the blank, read aloud). */
export function Prompt({ instruction, children }: { instruction?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {instruction && <Label>{instruction}</Label>}
      {children && <p className="text-2xl font-bold leading-snug">{children}</p>}
    </div>
  );
}

export type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong';

const CHOICE_STYLE: Record<ChoiceState, { box: string; key: string }> = {
  idle: { box: 'border-border bg-white hover:border-muted-foreground/40', key: 'border-border bg-white text-muted-foreground' },
  selected: { box: 'border-cobalto bg-cobalto/5', key: 'border-cobalto bg-cobalto text-white' },
  correct: { box: 'border-learned bg-learned/5', key: 'border-learned bg-learned text-white' },
  wrong: { box: 'border-correction bg-white', key: 'border-correction bg-white text-correction' },
};

/** A selectable answer with an optional number key. */
export function Choice({
  state = 'idle',
  keyLabel,
  tone,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { state?: ChoiceState; keyLabel?: string; tone?: string }) {
  const style = CHOICE_STYLE[state];
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-3.5 rounded-lg border-2 px-4.5 py-4 text-left text-lg font-semibold transition-colors',
        tone ?? style.box,
        className,
      )}
      {...props}
    >
      {keyLabel && (
        <span className={cn('flex size-7.5 shrink-0 items-center justify-center rounded-md border-2 font-display text-sm', style.key)}>
          {keyLabel}
        </span>
      )}
      <span className={cn(state === 'wrong' && 'text-muted-foreground line-through decoration-correction decoration-2')}>
        {children}
      </span>
    </button>
  );
}

export function TextField({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className={cn(
        'w-full rounded-lg border-2 border-border bg-white px-4.5 py-3.5 text-lg outline-none transition-colors focus:border-cobalto',
        className,
      )}
      {...props}
    />
  );
}

/** A word chip (arrange words). */
export function Chip({ active, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-lg border-2 px-3.5 py-2 text-base font-medium transition-colors',
        active ? 'border-cobalto bg-cobalto/5' : 'border-border bg-white hover:border-muted-foreground/40',
        className,
      )}
      {...props}
    />
  );
}

/** The row under the answers: secondary info on the left, the main action on the right. */
export function ActionRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-8">{children}</div>;
}

/** Primary action (Check, Continue…). Disabled looks quiet, not broken. */
export function ActionButton({
  tone = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'primary' | 'learned' | 'stroke' }) {
  return (
    <button
      type="button"
      className={cn(
        buttonVariants({ variant: tone === 'stroke' ? 'stroke' : 'default', size: 'xl' }),
        'min-w-40 shrink-0 disabled:border-2 disabled:border-border disabled:bg-white disabled:text-muted-foreground disabled:opacity-100',
        tone === 'learned' && 'bg-learned hover:bg-learned/90',
        className,
      )}
      {...props}
    />
  );
}

/** Replaces the action row after answering. */
export function FeedbackCard({
  tone,
  children,
  action,
}: {
  tone: 'learned' | 'correction' | 'in-progress';
  children: ReactNode;
  action: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-end justify-between gap-7 rounded-lg border border-t-5 border-border bg-white px-6 py-5',
        tone === 'learned' && 'border-t-learned',
        tone === 'correction' && 'border-t-correction',
        tone === 'in-progress' && 'border-t-in-progress',
      )}
    >
      <div className="flex min-w-0 flex-col gap-2">{children}</div>
      {action}
    </div>
  );
}
