import { Link } from 'react-router-dom';
import type { FeedbackContext } from '@/types';

/** Where a note was sent from, as a link back there. */
export function Place({ context }: { context: Partial<FeedbackContext> }) {
  const label = context.label ?? 'No place attached';
  const heading = context.heading ? ` · ${context.heading}` : '';
  if (!context.path) return <span className="text-sm text-muted-foreground">{label}{heading}</span>;
  return (
    <Link to={context.path} className="text-sm font-semibold text-cobalto hover:underline">
      {label}
      {heading}
    </Link>
  );
}

export function Quote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <span aria-hidden className="font-display text-lg leading-none text-cobalto">“</span>
      <i className="text-sm">{text}</i>
    </div>
  );
}
