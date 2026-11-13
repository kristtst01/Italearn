import { useGoBack } from '@/shared/utils/useGoBack';
import type { ReviewResult } from '@/types';
import { buttonVariants } from '@/components/ui/button';
import { PageHeader, StatRow } from '@/shared/components/design';
import SessionLayout from '@/shared/components/SessionLayout';

interface ReviewSummaryProps {
  result: ReviewResult;
}

export default function ReviewSummary({ result }: ReviewSummaryProps) {
  const goBack = useGoBack('/');
  const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <SessionLayout>
      <div className="flex flex-col gap-8 py-6">
        <PageHeader label="Review complete" title="Fatto!" />
        <StatRow
          stats={[
            { value: `${pct}%`, caption: `${result.correct} of ${result.total} correct` },
            { value: result.total, caption: `card${result.total !== 1 ? 's' : ''} reviewed` },
          ]}
        />
        <button type="button" onClick={goBack} autoFocus className={buttonVariants({ size: 'xl', className: 'min-w-44 self-start' })}>
          Done
        </button>
      </div>
    </SessionLayout>
  );
}
