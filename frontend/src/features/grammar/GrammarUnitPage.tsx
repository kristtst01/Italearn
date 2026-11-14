import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { GRAMMAR_PLAN, getPlannedGrammarUnit, type PlannedGrammarUnit } from '@/data/grammarPlan';
import { loadGrammarPractice, loadGrammarReading } from '@/data/grammarLoader';
import { getChapter } from '@/engine/chapters';
import { readingHeadings, sectionAnchor } from '@/engine/grammar';
import { useProgressStore } from '@/stores/progressStore';
import type { GrammarPractice, GrammarStop, GrammarUnitContent } from '@/types';
import { Label, Page, Placeholder, Status } from '@/shared/components/design';
import { buttonVariants } from '@/components/ui/button';
import EmptyState from '@/shared/components/EmptyState';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { cn } from '@/lib/utils';
import { RESTORE_SCROLL } from '@/shared/utils/scroll';
import GrammarReading from './GrammarReading';
import { useFeedbackContext } from '@/features/feedback/useFeedbackContext';

type Loaded = { reading?: GrammarUnitContent; practice?: GrammarPractice };

/** A grammar unit: study → practice → mastery check. Units not written yet show their outline. */
export default function GrammarUnitPage() {
  const { grammarId } = useParams<{ grammarId: string }>();
  const unit = grammarId ? getPlannedGrammarUnit(grammarId) : undefined;
  const [loaded, setLoaded] = useState<{ id: string; content: Loaded } | null>(null);
  useFeedbackContext(
    unit ? { kind: 'grammar', label: `Grammar · ${unit.title}`, path: `/grammar/${unit.id}`, grammar_id: unit.id } : null,
  );

  useEffect(() => {
    if (!grammarId) return;
    let cancelled = false;
    Promise.all([loadGrammarReading(grammarId), loadGrammarPractice(grammarId)]).then(([reading, practice]) => {
      if (!cancelled) setLoaded({ id: grammarId, content: { reading, practice } });
    });
    return () => { cancelled = true; };
  }, [grammarId]);

  if (!unit) return <EmptyState title="Grammar unit not found" message="This grammar unit doesn't exist." />;
  if (!loaded || loaded.id !== grammarId) return <LoadingScreen />;
  const { reading, practice } = loaded.content;

  return (
    <Page
      shapes={[
        { kind: 'circle', color: 'vermiglione', size: 260, position: { right: -110, top: 110 }, wideOnly: true },
        { kind: 'circle', color: 'ocra', size: 220, position: { right: -120, top: 900 }, wideOnly: true },
      ]}
      className="pb-24"
    >
      {/* Below the full layout the contents live in a bar above the reading, with the close button */}
      <ContentsBar>
        {reading ? <ContentsList unit={unit} reading={reading} practice={practice} /> : <OutlineList unit={unit} />}
      </ContentsBar>

      {/* Left-aligned like other pages; collapsed, the toggle sits in the page's left padding */}
      <div className="relative flex w-full items-start">
      {/* Pinned under the top bar, lined up with the page's right edge, so you can leave from anywhere */}
      <CloseLink className="fixed top-20 right-[max(3rem,calc((100vw-80rem)/2+3rem))] z-30 bg-background max-lg:hidden" />
      {reading ? <Contents unit={unit} reading={reading} practice={practice} /> : <Outline unit={unit} />}

      <article className="flex min-w-0 flex-1 flex-col gap-5.5 text-reading lg:pr-12">
        <div className="flex flex-col gap-1.5">
          <Label>A1 grammar · Unit {unit.order} of {GRAMMAR_PLAN.length}</Label>
          <h1 className="font-display text-title">{unit.title}</h1>
        </div>
        {reading ? (
          <>
            <GrammarReading
              body={reading.body}
              after={Object.fromEntries(
                (practice?.stops ?? []).map((stop, i) => [
                  stop.after,
                  <StopCard key={stop.id} unitId={unit.id} practice={practice!} stop={stop} index={i} />,
                ]),
              )}
            />
            {practice && <MasteryCheck unitId={unit.id} practice={practice} />}
            {reading.sources.length > 0 && (
              <div className="mt-6 flex max-w-4xl flex-col gap-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
                <Label>Sources</Label>
                {reading.sources.map((s) => <p key={s}>{s}</p>)}
              </div>
            )}
          </>
        ) : (
          <NotWritten unit={unit} />
        )}
      </article>
      </div>
    </Page>
  );
}

function UsedIn({ unit }: { unit: PlannedGrammarUnit }) {
  return (
    <div className="mt-3.5 flex flex-col gap-1.5 border-t border-border pt-3.5 text-sm text-muted-foreground">
      <span>Used in: {unit.chapters.map((c) => getChapter(c)?.name).filter(Boolean).join(', ')}</span>
    </div>
  );
}

function CloseLink({ className }: { className?: string }) {
  return (
    <Link
      to="/grammar"
      state={RESTORE_SCROLL}
      aria-label="Close and go back to Grammar"
      title="Back to Grammar"
      className={cn(
        'flex size-10 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-vuoto hover:text-foreground focus-visible:ring-2 focus-visible:ring-cobalto',
        className,
      )}
    >
      <X className="size-5.5" />
    </Link>
  );
}

/** The unit's headings, practice stops and mastery check, as links. Shared by the sidebar and the contents bar. */
function ContentsList({
  unit,
  reading,
  practice,
  onNavigate,
}: {
  unit: PlannedGrammarUnit;
  reading: GrammarUnitContent;
  practice?: GrammarPractice;
  onNavigate?: () => void;
}) {
  const progress = useProgressStore((s) => s.grammar_units[unit.id]);
  return (
    <ol className="flex flex-col gap-2.5 text-sm leading-snug">
      {readingHeadings(reading.body).flatMap((h, i) => {
        const stop = practice?.stops.find((s) => s.after === h.text);
        const done = !!stop && !!progress?.stopsDone?.includes(stop.id);
        return [
          // A little more room above each main section, so the groups read as groups
          <li key={h.text} className={cn(h.level === 3 ? 'pl-3.5' : i > 0 && 'mt-1.5')}>
            <a
              href={`#${sectionAnchor(h.text)}`}
              onClick={onNavigate}
              className={cn('hover:text-foreground', h.level === 2 ? 'font-medium text-foreground' : 'text-muted-foreground')}
            >
              {h.text}
            </a>
          </li>,
          stop && (
            <li key={`stop-${stop.id}`} className="pl-3.5">
              <a href={`#stop-${stop.id}`} onClick={onNavigate} className="flex items-center gap-2 font-bold text-grammar">
                <span className={cn('size-2 rotate-45', done ? 'bg-learned' : 'border border-grammar')} />
                Practice
              </a>
            </li>
          ),
        ];
      })}
      <li className="mt-1.5 flex flex-col gap-1 border-t border-border pt-3">
        <a href="#next" onClick={onNavigate} className="font-bold">Mastery check</a>
        {progress?.learnedAt ? <Status kind="learned" /> : progress?.lastCheck ? <Status kind="in-progress" label="Not passed yet" /> : null}
      </li>
    </ol>
  );
}

function OutlineList({ unit }: { unit: PlannedGrammarUnit }) {
  return (
    <ol className="flex flex-col gap-2 text-sm">
      {unit.covers.map((c, i) => (
        <li key={c} className="text-muted-foreground">{i + 1}. {c}</li>
      ))}
    </ol>
  );
}

/** Below the full layout: a bar under the top bar that opens the contents, with the close button. */
function ContentsBar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-13 z-30 -mx-4 -mt-5 mb-1 border-b border-border bg-background sm:top-14 sm:-mx-6 sm:-mt-7 lg:hidden">
      <div className="flex h-11 items-center justify-between gap-3 pr-2 pl-4 sm:pr-4 sm:pl-6">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex h-11 items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-cobalto"
        >
          <Label>Contents</Label>
          <ChevronDown className={cn('size-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} />
        </button>
        <CloseLink />
      </div>
      {open && (
        // Links close the panel; the page then scrolls to the section
        <div onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)} className="max-h-[60dvh] overflow-y-auto border-t border-border px-4 py-4 sm:px-6">
          {children}
        </div>
      )}
    </div>
  );
}

const CONTENTS_KEY = 'grammar-contents';

function readContentsOpen(): boolean {
  try {
    return localStorage.getItem(CONTENTS_KEY) !== 'closed';
  } catch {
    return true;
  }
}

function Contents({
  unit,
  reading,
  practice,
}: {
  unit: PlannedGrammarUnit;
  reading: GrammarUnitContent;
  practice?: GrammarPractice;
}) {
  const { hash } = useLocation();

  // Links into the reading (e.g. "read again" after a check) scroll once the page has rendered
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  const [open, setOpen] = useState(() => readContentsOpen());
  function toggle() {
    setOpen(!open);
    try {
      localStorage.setItem(CONTENTS_KEY, open ? 'closed' : 'open');
    } catch {
      // storage unavailable: the choice just isn't remembered
    }
  }

  return (
    <aside
      className={cn(
        'sticky top-26 shrink-0 transition-[width,margin] duration-300 ease-in-out max-lg:hidden motion-reduce:transition-none',
        open ? 'mr-14 w-56' : 'mr-0 w-0',
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Hide contents' : 'Show contents'}
        title={open ? 'Hide contents' : 'Show contents'}
        className={cn(
          // Open: top right of the panel. Collapsed: just left of the text.
          'absolute top-0 z-10 flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-[right] duration-300 ease-in-out hover:bg-vuoto hover:text-foreground focus-visible:ring-2 focus-visible:ring-cobalto motion-reduce:transition-none',
          open ? 'right-0' : 'right-3',
        )}
      >
        {open ? <PanelLeftClose className="size-4.5" /> : <PanelLeftOpen className="size-4.5" />}
      </button>
      <div className="overflow-hidden">
        <div
          inert={!open}
          className={cn(
            'flex max-h-[calc(100dvh-8rem)] w-56 flex-col gap-3.5 overflow-y-auto transition-opacity duration-200 motion-reduce:transition-none',
            open ? 'opacity-100 delay-100' : 'opacity-0',
          )}
        >
          <Label className="flex h-8 items-center">Contents</Label>
          <ContentsList unit={unit} reading={reading} practice={practice} />
          <UsedIn unit={unit} />
        </div>
      </div>
    </aside>
  );
}

/** A practice stop in the reading. Only the first stop not yet done is the highlighted action. */
function StopCard({
  unitId,
  practice,
  stop,
  index,
}: {
  unitId: string;
  practice: GrammarPractice;
  stop: GrammarStop;
  index: number;
}) {
  const stopsDone = useProgressStore((s) => s.grammar_units[unitId]?.stopsDone) ?? [];
  const done = stopsDone.includes(stop.id);
  const isNext = !done && practice.stops.find((s) => !stopsDone.includes(s.id))?.id === stop.id;

  return (
    <div
      id={`stop-${stop.id}`}
      className="my-4 flex scroll-mt-28 flex-col items-stretch gap-4 panel border-l-5 border-l-grammar px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6 sm:py-5 lg:scroll-mt-24"
    >
      <div className="flex flex-col gap-1">
        <Label className="text-grammar">
          Practice {index + 1} of {practice.stops.length}
        </Label>
        <p className="text-lg font-bold">{stop.title}</p>
        <p className="flex items-center gap-3 text-sm text-muted-foreground">
          {stop.exercises.length} exercises
          {done && <Status kind="learned" label="Done" />}
        </p>
      </div>
      <Link
        to={`/grammar/${unitId}/practice/${stop.id}`}
        className={cn(buttonVariants({ variant: isNext ? 'default' : 'stroke', size: 'xl' }), 'shrink-0')}
      >
        {done ? 'Practise again' : 'Practise'}
      </Link>
    </div>
  );
}

function MasteryCheck({ unitId, practice }: { unitId: string; practice: GrammarPractice }) {
  const progress = useProgressStore((s) => s.grammar_units[unitId]);
  const last = progress?.lastCheck;
  const missed = last && !last.passed ? last.missedPoints.map((p) => practice.points[p]).filter(Boolean) : [];

  return (
    <div id="next" className="mt-8 flex max-w-4xl scroll-mt-28 flex-col gap-5 border-t-2 border-foreground pt-6 lg:scroll-mt-24">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-heading">Mastery check</h2>
          <p className="text-base text-muted-foreground">
            {practice.mastery.exercises.length} questions, no notes. Pass with {Math.round(practice.mastery.pass_mark * 100)}% and
            the unit is learned.
          </p>
          {last && (
            <p className="text-base">
              Last attempt: <b>{last.score} of {last.total}</b>
              {progress?.learnedAt ? ' · Learned' : last.passed ? ' · Passed' : ' · Not passed yet'}
            </p>
          )}
        </div>
        <Link
          to={`/grammar/${unitId}/check`}
          className={cn(
            buttonVariants({ variant: progress?.practisedAt && !progress.learnedAt ? 'default' : 'stroke', size: 'xl' }),
            'shrink-0',
          )}
        >
          {last ? 'Retake the check' : 'Take the check'}
        </Link>
      </div>

      {missed.length > 0 && (
        <div className="flex flex-col gap-1.5 panel border-t-5 border-t-correction px-5 py-4">
          <Label>Read again before retaking</Label>
          {missed.map((p) => (
            <a key={p.label} href={`#${sectionAnchor(p.section)}`} className="font-medium text-cobalto">
              {p.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Outline({ unit }: { unit: PlannedGrammarUnit }) {
  return (
    <aside className="sticky top-26 mr-14 flex w-56 shrink-0 flex-col gap-3.5 max-lg:hidden">
      <Label>Contents</Label>
      <OutlineList unit={unit} />
      <UsedIn unit={unit} />
    </aside>
  );
}

function NotWritten({ unit }: { unit: PlannedGrammarUnit }) {
  return (
    <Placeholder
      label="Not written yet"
      title="This unit's explanation is coming"
      description="A full explanation of every form, rule and exception at A1, with tables and typical mistakes, then practice and a mastery check. It will cover:"
    >
      <ul className="mt-1.5 list-disc pl-5 text-sm text-muted-foreground">
        {unit.covers.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </Placeholder>
  );
}
