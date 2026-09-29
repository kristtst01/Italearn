import type { ReactNode } from 'react';
import ProgressBar from './ProgressBar';

interface SessionHeaderProps {
  /** Exit control (a close button, possibly with a confirm dialog) */
  exit: ReactNode;
  /** What this session is, e.g. "My Family · Close Family" or "Review" */
  label: string;
  progress: number;
  counter: string;
}

/** Top bar for immersive sessions (lessons, review). */
export default function SessionHeader({ exit, label, progress, counter }: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-6 px-8">
        {exit}
        <span className="max-w-60 truncate text-sm font-bold">{label}</span>
        <div className="flex-1">
          <ProgressBar progress={progress} />
        </div>
        <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">{counter}</span>
      </div>
    </header>
  );
}
