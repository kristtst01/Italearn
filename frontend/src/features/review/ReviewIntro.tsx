import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Label } from '@/shared/components/design';

interface ReviewIntroProps {
  dueCount: number;
  onStart: () => void;
}

export default function ReviewIntro({ dueCount, onStart }: ReviewIntroProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <div className="flex max-w-lg flex-col gap-5">
        <Label>Review</Label>
        {dueCount === 0 ? (
          <>
            <h1 className="font-display text-title">All caught up</h1>
            <p className="text-reading text-muted-foreground">Nothing is due right now. Come back later, or keep learning.</p>
            <Link to="/" className={buttonVariants({ size: 'xl', className: 'self-start' })}>Back to Today</Link>
          </>
        ) : (
          <>
            <h1 className="font-display text-title">
              {dueCount} {dueCount === 1 ? 'card' : 'cards'} due
            </h1>
            <p className="text-reading text-muted-foreground">Short retrievals keep what you've learned from fading.</p>
            <div className="flex gap-3">
              <button type="button" onClick={onStart} autoFocus className={buttonVariants({ size: 'xl', className: 'min-w-40' })}>
                Start
              </button>
              <Link to="/" className={buttonVariants({ variant: 'stroke', size: 'xl' })}>Later</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
