import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/*
 * Shared building blocks for exercises, so every type looks and behaves the same.
 * Colours come from design tokens only (docs/design-system.md).
 */

/** The task: an optional small instruction above the main prompt. */
export function Prompt({ instruction, children }: { instruction?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {instruction && <p className="text-sm font-medium text-muted-foreground">{instruction}</p>}
      {children && <p className="text-2xl font-bold leading-snug">{children}</p>}
    </div>
  );
}

/** A selectable answer (multiple choice, match pairs). */
export function Choice({
  selected,
  tone,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; tone?: string }) {
  return (
    <button
      type="button"
      className={cn(
        'w-full rounded-lg border-2 bg-white px-4.5 py-3.5 text-left text-base font-medium transition-colors',
        tone ?? (selected ? 'border-cobalto bg-cobalto/5' : 'border-border hover:border-muted-foreground/40'),
        className,
      )}
      {...props}
    />
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

/** Fixed bar at the bottom of a session: actions, or feedback after answering. */
export function ActionBar({ tone, children }: { tone?: 'learned' | 'correction' | 'in-progress'; children: ReactNode }) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t bg-white',
        tone === 'learned' && 'border-t-4 border-learned',
        tone === 'correction' && 'border-t-4 border-correction',
        tone === 'in-progress' && 'border-t-4 border-in-progress',
        !tone && 'border-border',
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-8 px-8 py-5">{children}</div>
    </div>
  );
}
