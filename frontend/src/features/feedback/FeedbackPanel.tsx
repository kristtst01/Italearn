import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Type, X } from 'lucide-react';
import { toast } from 'sonner';
import { sendFeedback } from '@/engine/api';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { Label } from '@/shared/components/design';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CATEGORY, LEARNER_CATEGORIES } from './categories';

const PANEL_ID = 'feedback-panel';

/** The nearest heading above a node, so a quote can say which part of the page it's from. */
function headingAbove(node: Node | null): string | undefined {
  let el: Element | null = node instanceof Element ? node : node?.parentElement ?? null;
  while (el && el !== document.body) {
    if (/^H[1-4]$/.test(el.tagName)) return el.textContent?.trim() || undefined;
    let sib = el.previousElementSibling;
    while (sib) {
      // Never the panel's own title
      if (sib.id === PANEL_ID || sib.querySelector(`#${PANEL_ID}`)) {
        sib = sib.previousElementSibling;
        continue;
      }
      if (/^H[1-4]$/.test(sib.tagName)) return sib.textContent?.trim() || undefined;
      const inner = sib.querySelectorAll('h1, h2, h3, h4');
      if (inner.length) return inner[inner.length - 1].textContent?.trim() || undefined;
      sib = sib.previousElementSibling;
    }
    el = el.parentElement;
  }
  return undefined;
}

/** The current text selection, unless it's empty or inside the feedback panel itself. */
function readSelection(): { text: string; heading?: string } | null {
  const sel = window.getSelection();
  const text = sel?.toString().trim();
  if (!sel || !text || sel.rangeCount === 0) return null;
  const anchor = sel.getRangeAt(0).startContainer;
  const anchorEl = anchor instanceof Element ? anchor : anchor.parentElement;
  if (anchorEl?.closest(`#${PANEL_ID}`)) return null;
  return { text: text.slice(0, 2000), heading: headingAbove(anchor) };
}

/** The bar shown while the learner picks a passage to quote. */
function SelectBar() {
  const stopSelecting = useFeedbackStore((s) => s.stopSelecting);
  const setQuote = useFeedbackStore((s) => s.setQuote);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    // With a mouse, letting go of a selection takes it straight away
    function onPointerUp(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return;
      const quote = readSelection();
      if (quote) {
        setQuote(quote);
        window.getSelection()?.removeAllRanges();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') stopSelecting();
    }
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('keydown', onKey);
    };
  }, [setQuote, stopSelecting]);

  function useSelection() {
    const quote = readSelection();
    if (!quote) {
      setEmpty(true);
      return;
    }
    setQuote(quote);
    window.getSelection()?.removeAllRanges();
  }

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-4 z-50 flex flex-col gap-2.5 rounded-xl bg-nero p-3 pl-4 text-white sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-120 sm:-translate-x-1/2 lg:top-20 lg:bottom-auto lg:flex-row lg:items-center"
    >
      <span className="flex flex-1 items-center gap-2.5 text-sm font-semibold">
        <Type className="size-4.5 shrink-0" aria-hidden />
        {empty ? 'Select some text first' : 'Select the text you want to quote'}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={stopSelecting}
          className="h-11 flex-1 rounded-lg border-2 border-white px-4 text-[0.9375rem] font-bold lg:h-9"
        >
          Cancel
        </button>
        {/* Touch screens: selection handles are fiddly, so the learner confirms */}
        <button
          type="button"
          onClick={useSelection}
          className="h-11 flex-1 rounded-lg bg-white px-4 text-[0.9375rem] font-bold text-nero pointer-fine:hidden lg:h-9"
        >
          Use selection
        </button>
      </div>
    </div>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
    >
      <X className="size-3.5" strokeWidth={2.5} />
    </button>
  );
}

/**
 * The feedback panel: a side panel from half-screen width up, a bottom sheet on a phone.
 * Rendered once in App; FeedbackButton opens it.
 */
export default function FeedbackPanel() {
  const open = useFeedbackStore((s) => s.open);
  const selecting = useFeedbackStore((s) => s.selecting);
  const attached = useFeedbackStore((s) => s.attached);
  const quote = useFeedbackStore((s) => s.quote);
  const draft = useFeedbackStore((s) => s.draft);
  const categories = useFeedbackStore((s) => s.categories);
  const { closePanel, removeAttached, setDraft, toggleCategory, startSelecting, setQuote, reset, refreshSummary } =
    useFeedbackStore.getState();
  const [sending, setSending] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && !selecting) textRef.current?.focus();
  }, [open, selecting]);

  useEffect(() => {
    if (!open || selecting) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closePanel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, selecting, closePanel]);

  if (!open) return null;

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const context = attached ? { ...attached, heading: quote?.heading } : quote?.heading ? { heading: quote.heading } : {};
      await sendFeedback({ text, quote: quote?.text ?? null, context, categories });
      reset();
      toast.success('Thanks! You can follow your feedback in Profile.');
      refreshSummary();
    } catch (err) {
      console.error('Failed to send feedback:', err);
      // Keep the note so nothing is lost
      toast.error('Could not send your feedback. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {selecting && <SelectBar />}
      {/* Phone: a scrim behind the sheet. Wider, the panel sits beside the page, which stays usable */}
      {!selecting && <div aria-hidden onClick={closePanel} className="fixed inset-0 z-40 bg-nero/40 sm:hidden" />}
      <aside
        id={PANEL_ID}
        aria-label="Feedback"
        // Keys typed here stay here: lessons listen for Enter and 1–4 on the whole window
        onKeyDown={(e) => {
          if (e.key === 'Escape') closePanel();
          e.stopPropagation();
        }}
        className={cn(
          'fixed z-50 flex flex-col gap-4 overflow-y-auto bg-white',
          'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl px-4 pt-2.5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]',
          'sm:inset-x-auto sm:top-0 sm:right-0 sm:max-h-none sm:w-110 sm:rounded-none sm:border-l sm:border-border sm:px-8 sm:py-7 sm:gap-5',
          // While quoting, the panel steps aside so the whole page can be selected
          selecting && 'hidden',
        )}
      >
        <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-linea sm:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Label className="max-sm:hidden">Feedback</Label>
            <h2 className="font-display text-[1.375rem] leading-tight sm:text-2xl">What did you notice?</h2>
          </div>
          <button
            type="button"
            aria-label="Close feedback"
            onClick={closePanel}
            className="-mr-2.5 flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <Label>About</Label>
          {attached && (
            <span className="flex h-9 items-center gap-1.5 self-start rounded-lg border border-border pr-1 pl-3 text-sm font-semibold">
              <span className="truncate">{attached.label}</span>
              <RemoveButton label="Remove the place" onClick={removeAttached} />
            </span>
          )}
          {quote && (
            <div className="flex items-start gap-2.5 rounded-lg border border-border bg-background py-2 pr-1 pl-3">
              <span aria-hidden className="font-display text-xl leading-none text-cobalto">“</span>
              <i className="line-clamp-4 flex-1 pt-0.5 text-[0.9375rem]">{quote.text}</i>
              <RemoveButton label="Remove the quote" onClick={() => setQuote(null)} />
            </div>
          )}
          <button
            type="button"
            onClick={startSelecting}
            className={cn(buttonVariants({ variant: 'stroke' }), 'h-11 gap-2 self-start px-3.5 text-sm sm:h-9')}
          >
            <Type className="size-4" aria-hidden />
            {quote ? 'Quote something else' : 'Quote text'}
          </button>
          {!attached && !quote && <p className="text-sm text-muted-foreground">Optional: point at the text you mean.</p>}
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="contents">
            <Label>
              What kind? <span className="font-medium normal-case tracking-normal">(optional)</span>
            </Label>
          </legend>
          <div className="flex flex-wrap gap-2">
            {LEARNER_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={categories.includes(c)}
                onClick={() => toggleCategory(c)}
                className={cn(
                  'h-9 rounded-lg border-2 px-3 text-sm font-semibold max-sm:h-10',
                  categories.includes(c) ? 'border-cobalto bg-cobalto text-white' : 'border-border bg-white hover:border-foreground',
                )}
              >
                {CATEGORY[c].learnerLabel}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Pick as many as fit. Not sure? Leave it. We sort every note ourselves.</p>
        </fieldset>

        <label className="flex flex-col gap-2">
          <Label>Your note</Label>
          <textarea
            ref={textRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send();
            }}
            maxLength={5000}
            rows={5}
            placeholder="A mistake, something unclear, a bug, an idea…"
            className="min-h-32 resize-y rounded-lg border-2 border-border px-3.5 py-3 text-[0.9375rem] leading-normal outline-none focus:border-cobalto"
          />
        </label>

        <div className="flex-1" />
        <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch">
          <span className="text-sm text-muted-foreground">
            Goes straight to the ItaLearn team. You can see its status in{' '}
            <Link to="/profile/feedback" onClick={closePanel} className="font-semibold text-cobalto hover:underline">
              your profile
            </Link>
            .
          </span>
          <button
            type="button"
            onClick={send}
            disabled={!draft.trim() || sending}
            className={cn(buttonVariants({ size: 'xl' }), 'h-12 px-7 max-sm:w-full')}
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </aside>
    </>
  );
}

/** Opens the feedback panel. `session`: the outlined button in session headers; `bar`: the top bar. */
export function FeedbackButton({ variant }: { variant: 'session' | 'bar' }) {
  const openPanel = useFeedbackStore((s) => s.openPanel);
  if (variant === 'bar') {
    return (
      <button
        type="button"
        onClick={openPanel}
        aria-label="Feedback"
        className="flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground max-lg:size-11 max-lg:justify-center"
      >
        <MessageSquare className="size-4.5 lg:size-4" aria-hidden />
        <span className="max-lg:hidden">Feedback</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={openPanel}
      aria-label="Feedback"
      className="flex items-center gap-1.5 rounded-lg font-bold text-foreground max-sm:size-11 max-sm:justify-center sm:h-9 sm:border-2 sm:border-foreground sm:px-3 sm:text-sm"
    >
      <MessageSquare className="size-5 sm:size-4" aria-hidden />
      <span className="max-sm:hidden">Feedback</span>
    </button>
  );
}
