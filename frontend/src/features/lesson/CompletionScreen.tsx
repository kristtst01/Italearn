import type { LessonResult } from '@/types';
import Confetti from '@/shared/components/Confetti';
import { PageHeader, Stamp, StatRow } from '@/shared/components/design';
import { buttonVariants } from '@/components/ui/button';

interface CompletionScreenProps {
  result: LessonResult;
  lessonName: string;
  isRetry: boolean;
  hasMistakes: boolean;
  /** Set when finishing this lesson earns the chapter's stamp */
  stamp?: { title: string; caption: string };
  onPracticeMistakes: () => void;
  onContinue: () => void;
}

export default function CompletionScreen({
  result,
  lessonName,
  isRetry,
  hasMistakes,
  stamp,
  onPracticeMistakes,
  onContinue,
}: CompletionScreenProps) {
  const pct = Math.round((result.score / result.total) * 100);
  const minutes = Math.floor(result.timeMs / 60000);
  const seconds = Math.floor((result.timeMs % 60000) / 1000);

  return (
    <div className="flex flex-col gap-8 py-6">
      {stamp && <Confetti />}
      <PageHeader
        className="items-start"
        label={isRetry ? 'Mistakes practised' : 'Lesson complete'}
        title={pct === 100 ? 'Perfetto!' : 'Fatto!'}
        description={lessonName}
        aside={
          stamp && (
            <div className="flex flex-col items-center gap-1.5">
              <Stamp title={stamp.title} caption={stamp.caption} earned />
              <span className="text-xs font-bold text-correction">Stamp earned</span>
            </div>
          )
        }
      />

      <StatRow
        stats={[
          { value: `${pct}%`, caption: `${result.score} of ${result.total} correct` },
          { value: result.wordsEncountered.length, caption: 'words practised' },
          { value: `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`, caption: 'time' },
        ]}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onContinue}
          autoFocus={!hasMistakes}
          className={buttonVariants({ size: 'xl', className: 'min-w-44' })}
        >
          Back to Today
        </button>
        {hasMistakes && (
          <button
            type="button"
            onClick={onPracticeMistakes}
            autoFocus
            className={buttonVariants({ variant: 'stroke', size: 'xl' })}
          >
            Practise mistakes ({result.total - result.score})
          </button>
        )}
      </div>
    </div>
  );
}
