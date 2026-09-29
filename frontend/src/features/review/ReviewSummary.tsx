import { Link } from 'react-router-dom';
import type { ReviewResult } from '@/types';
import { buttonVariants } from '@/components/ui/button';
import { Label } from '@/shared/components/design';

interface ReviewSummaryProps {
  result: ReviewResult;
}

export default function ReviewSummary({ result }: ReviewSummaryProps) {
  const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <Label>Review complete</Label>
        <h1 className="font-display text-title">Fatto!</h1>
        <div className="grid grid-cols-2 border-y border-border py-6">
          <div className="flex flex-col gap-1">
            <span className="font-display text-4xl">{pct}%</span>
            <span className="text-sm text-muted-foreground">{result.correct} of {result.total} correct</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-4xl">{result.total}</span>
            <span className="text-sm text-muted-foreground">card{result.total !== 1 ? 's' : ''} reviewed</span>
          </div>
        </div>
        <Link to="/" autoFocus className={buttonVariants({ size: 'xl', className: 'self-start' })}>Back to Today</Link>
      </div>
    </div>
  );
}
