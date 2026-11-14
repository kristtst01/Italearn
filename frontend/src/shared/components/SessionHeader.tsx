import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Segment } from '@/shared/utils/segments';
import { FeedbackButton } from '@/features/feedback/FeedbackPanel';

const SEGMENT_STYLE: Record<Segment, string> = {
  right: 'bg-learned',
  wrong: 'bg-correction',
  skipped: 'bg-muted-foreground/40',
  current: 'border-2 border-cobalto bg-white',
  todo: 'bg-vuoto',
};

interface SessionHeaderProps {
  /** Exit control (a close button, possibly with a confirm dialog) */
  exit: ReactNode;
  /** Small label above the title, e.g. "Chapter 01 · Greetings & Survival Phrases" */
  context?: string;
  title: string;
  segments: Segment[];
  counter: string;
  /** The chapter's stamp, shown small at the right (full layout only) */
  stamp?: { earned: boolean };
}

/**
 * Top bar for immersive sessions (lessons, review, grammar practice). One row in the full layout;
 * narrower, the progress segments get a row of their own, and on a phone the exit moves to the left.
 */
export default function SessionHeader({ exit, context, title, segments, counter, stamp }: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1.5 px-4 pt-1 pb-2.5 sm:gap-x-4 sm:px-6 sm:pt-2 sm:pb-3 lg:h-18 lg:flex-nowrap lg:gap-x-7 lg:px-14 lg:py-0">
        <div className="order-1 flex max-sm:-ml-2.5 sm:order-5 lg:order-6">{exit}</div>
        <div className="order-2 flex min-w-0 flex-1 flex-col lg:max-w-80 lg:flex-none">
          {context && (
            <span className="truncate text-[0.6875rem] font-bold tracking-label text-muted-foreground uppercase sm:text-xs">{context}</span>
          )}
          <span className="truncate text-[0.9375rem] font-bold sm:text-base">{title}</span>
        </div>
        <div className="order-7 flex basis-full gap-0.75 lg:order-3 lg:flex-1 lg:basis-auto lg:gap-1">
          {segments.map((s, i) => (
            <div key={i} className={cn('box-border h-1.5 flex-1 rounded-xs lg:h-2', SEGMENT_STYLE[s])} />
          ))}
        </div>
        <span className="order-3 text-sm whitespace-nowrap text-muted-foreground tabular-nums lg:order-4">{counter}</span>
        {stamp && (
          <div
            title={stamp.earned ? 'Chapter stamp earned' : 'Chapter stamp'}
            className={cn(
              'order-5 hidden h-10.5 w-8.5 shrink-0 items-start justify-end border-2 border-dotted bg-white p-0.75 lg:flex',
              stamp.earned ? 'border-vermiglione-scuro' : 'border-muted-foreground/40',
            )}
          >
            <span className={cn('size-1.5 rounded-full', stamp.earned ? 'bg-vermiglione-scuro' : 'border border-muted-foreground/60')} />
          </div>
        )}
        <div className="order-4 flex lg:order-5">
          <FeedbackButton variant="session" />
        </div>
      </div>
    </header>
  );
}
