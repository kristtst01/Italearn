import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getMyFeedback, markMyFeedbackRead, removeMyFeedback } from '@/engine/api';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { Label } from '@/shared/components/design';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { cn } from '@/lib/utils';
import type { LearnerFeedbackStatus, MyFeedback } from '@/types';
import { Place, Quote } from './parts';
import { timeAgo } from './timeAgo';

const STATUS: Record<LearnerFeedbackStatus, { label: string; dot: string }> = {
  received: { label: 'Received', dot: 'border-2 border-muted-foreground bg-white' },
  in_progress: { label: 'Looking into it', dot: 'bg-in-progress' },
  fixed: { label: 'Fixed', dot: 'bg-learned' },
  wont_fix: { label: "Won't change", dot: 'bg-muted-foreground' },
};

/** Profile › Your feedback: everything the learner has sent, and what happened to it. */
export default function YourFeedback() {
  const [items, setItems] = useState<MyFeedback[] | null>(null);
  const [failed, setFailed] = useState(false);
  const refreshSummary = useFeedbackStore((s) => s.refreshSummary);
  const openPanel = useFeedbackStore((s) => s.openPanel);
  const [confirming, setConfirming] = useState<string | null>(null);

  async function remove(id: string) {
    try {
      await removeMyFeedback(id);
      setItems((list) => list?.filter((f) => f.id !== id) ?? null);
      refreshSummary();
    } catch (err) {
      console.error('Failed to remove feedback:', err);
      toast.error('Could not remove it. Try again.');
    } finally {
      setConfirming(null);
    }
  }

  useEffect(() => {
    let cancelled = false;
    getMyFeedback()
      .then(async (list) => {
        if (cancelled) return;
        setItems(list);
        // Seen now: clear the dot (the cards keep their "new" mark until next time)
        if (list.some((f) => f.unread)) {
          await markMyFeedbackRead();
          refreshSummary();
        }
      })
      .catch((err) => {
        console.error('Failed to load your feedback:', err);
        if (!cancelled) setFailed(true);
      });
    return () => { cancelled = true; };
  }, [refreshSummary]);

  if (failed) return <p className="text-muted-foreground">Your feedback couldn't be loaded. Try again in a moment.</p>;
  if (!items) return <LoadingScreen />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-muted-foreground">
          Nothing here yet. Spotted a mistake, something unclear or a bug? Tell us from any page.
        </p>
        <button type="button" onClick={openPanel} className="font-bold text-cobalto hover:underline">
          Send feedback
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[0.9375rem] text-muted-foreground">Everything you have sent, and what happened to it.</p>
      {items.map((f) => {
        const status = STATUS[f.status];
        return (
          <article key={f.id} className="panel flex flex-col gap-2.5 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className={cn('size-2.5 shrink-0 rounded-full', status.dot)} />
                {status.label}
                {f.unread && <span className="text-xs font-bold tracking-label text-correction uppercase">New</span>}
              </span>
              <span className="text-sm text-muted-foreground">Sent {timeAgo(f.created_at)}</span>
            </div>
            <Place context={f.context} />
            {f.quote && <Quote text={f.quote} />}
            <p className="text-[0.9375rem] leading-normal whitespace-pre-line">{f.text}</p>
            {f.reply && (
              <div className="flex flex-col gap-1 rounded-lg border border-border bg-background px-3.5 py-2.5">
                <Label>Reply from ItaLearn</Label>
                <p className="text-[0.9375rem] leading-normal whitespace-pre-line">{f.reply}</p>
              </div>
            )}
            {confirming === f.id ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground">Remove it from this list? The team still has your note.</span>
                <button type="button" onClick={() => remove(f.id)} className="font-bold text-correction hover:underline">
                  Remove
                </button>
                <button type="button" onClick={() => setConfirming(null)} className="font-medium text-muted-foreground hover:text-foreground">
                  Keep
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(f.id)}
                className="self-start text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Remove from my list
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
