import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/design';
import SessionLayout from '@/shared/components/SessionLayout';

interface ReviewIntroProps {
  dueCount: number;
  onStart: () => void;
}

export default function ReviewIntro({ dueCount, onStart }: ReviewIntroProps) {
  return (
    <SessionLayout>
      <div className="flex flex-col gap-8 py-6">
        {dueCount === 0 ? (
          <>
            <PageHeader
              label="Review"
              title="All caught up"
              description="Nothing is due right now. Come back later, or keep learning."
            />
            <Link to="/" className={buttonVariants({ size: 'xl', className: 'min-w-44 self-start' })}>Back to Today</Link>
          </>
        ) : (
          <>
            <PageHeader
              label="Review"
              title={`${dueCount} ${dueCount === 1 ? 'card' : 'cards'} due`}
              description="Short retrievals keep what you've learned from fading."
            />
            <div className="flex gap-3">
              <button type="button" onClick={onStart} autoFocus className={buttonVariants({ size: 'xl', className: 'min-w-44' })}>
                Start
              </button>
              <Link to="/" className={buttonVariants({ variant: 'stroke', size: 'xl' })}>Later</Link>
            </div>
          </>
        )}
      </div>
    </SessionLayout>
  );
}
