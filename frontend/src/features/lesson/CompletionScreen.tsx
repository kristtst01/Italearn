import type { LessonResult } from '@/types';
import Confetti from '@/shared/components/Confetti';
import { Label, Stamp } from '@/shared/components/design';
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
      <div className="flex items-start justify-between gap-8">
        <div className="flex flex-col gap-2">
          <Label>{isRetry ? 'Mistakes practised' : 'Lesson complete'}</Label>
          <h1 className="font-display text-title">{pct === 100 ? 'Perfetto!' : 'Fatto!'}</h1>
          <p className="text-muted-foreground">{lessonName}</p>
        </div>
        {stamp && (
          <div className="flex flex-col items-center gap-1.5">
            <Stamp title={stamp.title} caption={stamp.caption} earned />
            <span className="text-xs font-bold text-correction">Stamp earned</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 border-y border-border py-6">
        <div className="flex flex-col gap-1">
          <span className="font-display text-4xl">{pct}%</span>
          <span className="text-sm text-muted-foreground">{result.score} of {result.total} correct</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-display text-4xl">{result.wordsEncountered.length}</span>
          <span className="text-sm text-muted-foreground">words practised</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-display text-4xl">{minutes > 0 ? `${minutes}m ` : ''}{seconds}s</span>
          <span className="text-sm text-muted-foreground">time</span>
        </div>
      </div>

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
