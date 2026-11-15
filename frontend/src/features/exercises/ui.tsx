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
      <p className="min-h-[2lh] text-xl font-bold leading-snug sm:text-2xl">
        <HighlightedText text={text} words={exercise.target_words} />
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{split.instruction}</Label>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="font-display text-[3.25rem] leading-none tracking-tight sm:text-6xl lg:text-7xl">{split.hero}</span>
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
export function Prompt({
  instruction,
  long = false,
  children,
}: {
  instruction?: ReactNode;
  /** A long instruction (a writing task): a calmer size than a short question */
  long?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {instruction && <Label>{instruction}</Label>}
      {children && (
        <p className={cn('min-h-[2lh] leading-snug', long ? 'text-lg font-semibold' : 'text-xl font-bold sm:text-2xl')}>
          {children}
        </p>
      )}
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
        'flex min-h-13 w-full items-center gap-3.5 rounded-lg border-2 px-4 py-3 text-left text-base font-semibold transition-colors sm:px-4.5 sm:py-4 sm:text-lg',
        tone ?? style.box,
        className,
      )}
      {...props}
    >
      {keyLabel && (
        // Number keys only help with a keyboard
        <span className={cn('flex size-7.5 shrink-0 items-center justify-center rounded-md border-2 font-display text-sm max-sm:hidden pointer-coarse:hidden', style.key)}>
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

const ACCENTS = ['à', 'è', 'é', 'ì', 'ò', 'ù', 'È'];

// The text field the learner last typed in, so a click on an accent knows where it goes
let lastField: HTMLInputElement | HTMLTextAreaElement | null = null;
if (typeof document !== 'undefined') {
  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (t instanceof HTMLTextAreaElement || (t instanceof HTMLInputElement && t.type === 'text')) lastField = t;
  });
}

/** Writes text at the cursor of a React-controlled field (setting .value directly skips onChange). */
function insertAtCursor(field: HTMLInputElement | HTMLTextAreaElement, text: string) {
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? start;
  const next = field.value.slice(0, start) + text + field.value.slice(end);
  const proto = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(field, next);
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.focus();
  field.setSelectionRange(start + text.length, start + text.length);
}

/**
 * Buttons for the accented letters, under any typing field: most keyboards outside Italy have no
 * easy way to type them. Clicking keeps the cursor in the field.
 */
export function AccentKeys({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {ACCENTS.map((a) => (
        <button
          key={a}
          type="button"
          tabIndex={-1}
          aria-label={`Type ${a}`}
          // mousedown, so the field keeps focus and its cursor position
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const active = document.activeElement;
            const field =
              active instanceof HTMLTextAreaElement || (active instanceof HTMLInputElement && active.type === 'text')
                ? active
                : lastField?.isConnected ? lastField : null;
            if (field && !field.disabled) insertAtCursor(field, a);
          }}
          className="flex size-9 items-center justify-center rounded-md border border-border bg-white text-base font-semibold hover:border-muted-foreground/40"
        >
          {a}
        </button>
      ))}
    </div>
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

/**
 * The row under the answers: secondary info on the left, the main action on the right.
 * On a phone the action goes full width on top, with the secondary info under it.
 */
export function ActionRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse items-stretch gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:text-left">
      {children}
    </div>
  );
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
        'shrink-0 max-sm:w-full sm:min-w-40 disabled:border-2 disabled:border-border disabled:bg-white disabled:text-muted-foreground disabled:opacity-100',
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
        'flex flex-col items-stretch gap-4 panel border-t-5 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-7 sm:px-6 sm:py-5',
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
