import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Segment } from '@/shared/utils/segments';

const SEGMENT_STYLE: Record<Segment, string> = {
  right: 'bg-learned',
  wrong: 'bg-correction',
  skipped: 'bg-muted-foreground/40',
  current: 'border-2 border-cobalto bg-white',
  todo: 'bg-vuoto',
};

interface SessionHeaderProps {
  /** Exit control (a close button, possibly with a confirm dialog), shown at the right end */
  exit: ReactNode;
  /** Small label above the title, e.g. "Chapter 01 · Greetings & Survival Phrases" */
  context?: string;
  title: string;
  segments: Segment[];
  counter: string;
  /** The chapter's stamp, shown small at the right */
  stamp?: { earned: boolean };
}

/** Top bar for immersive sessions (lessons, review). */
export default function SessionHeader({ exit, context, title, segments, counter, stamp }: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-7 px-14">
        <div className="flex shrink-0 flex-col">
          {context && <span className="text-xs font-bold tracking-label text-muted-foreground uppercase">{context}</span>}
          <span className="font-bold">{title}</span>
        </div>
        <div className="flex flex-1 gap-1">
          {segments.map((s, i) => (
            <div key={i} className={cn('h-2 flex-1 rounded-xs box-border', SEGMENT_STYLE[s])} />
          ))}
        </div>
        <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">{counter}</span>
        {stamp && (
          <div
            title={stamp.earned ? 'Chapter stamp earned' : 'Chapter stamp'}
            className={cn(
              'flex h-10.5 w-8.5 shrink-0 items-start justify-end border-2 border-dotted bg-white p-0.75',
              stamp.earned ? 'border-vermiglione-scuro' : 'border-muted-foreground/40',
            )}
          >
            <span className={cn('size-1.5 rounded-full', stamp.earned ? 'bg-vermiglione-scuro' : 'border border-muted-foreground/60')} />
          </div>
        )}
        {/* Exit sits at the top right, like the close button on grammar units */}
        {exit}
      </div>
    </header>
  );
}
