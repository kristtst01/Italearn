import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
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
import GrammarReading from './GrammarReading';

type Loaded = { reading?: GrammarUnitContent; practice?: GrammarPractice };

/** A grammar unit: study → practice → mastery check. Units not written yet show their outline. */
export default function GrammarUnitPage() {
  const { grammarId } = useParams<{ grammarId: string }>();
  const unit = grammarId ? getPlannedGrammarUnit(grammarId) : undefined;
  const [loaded, setLoaded] = useState<{ id: string; content: Loaded } | null>(null);

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
      {/* Left-aligned like other pages; collapsed, the toggle sits in the page's left padding */}
      <div className="flex w-full items-start">
      {reading ? <Contents unit={unit} reading={reading} practice={practice} /> : <Outline unit={unit} />}

      <article className="flex min-w-0 flex-1 flex-col gap-5.5 text-reading">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-4">
            <Label>A1 grammar · Unit {unit.order} of {GRAMMAR_PLAN.length}</Label>
            <Link
              to="/grammar"
              aria-label="Close and go back to Grammar"
              title="Back to Grammar"
              className="-my-1.5 -mr-1.5 flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-vuoto hover:text-foreground focus-visible:ring-2 focus-visible:ring-cobalto"
            >
              <X className="size-5" />
            </Link>
          </div>
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
  const progress = useProgressStore((s) => s.grammar_units[unit.id]);

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
        'sticky top-26 shrink-0 transition-[width,margin] duration-300 ease-in-out motion-reduce:transition-none',
        open ? 'mr-10 w-44' : 'mr-0 w-0',
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
            'flex max-h-[calc(100dvh-8rem)] w-44 flex-col gap-3 overflow-y-auto transition-opacity duration-200 motion-reduce:transition-none',
            open ? 'opacity-100 delay-100' : 'opacity-0',
          )}
        >
          <Label className="flex h-8 items-center">Contents</Label>
          <ol className="flex flex-col gap-1.5 text-sm">
            {readingHeadings(reading.body).flatMap((h) => {
              const stop = practice?.stops.find((s) => s.after === h.text);
              const done = !!stop && !!progress?.stopsDone?.includes(stop.id);
              return [
                <li key={h.text} className={cn(h.level === 3 && 'pl-3')}>
                  <a
                    href={`#${sectionAnchor(h.text)}`}
                    className={cn('hover:text-foreground', h.level === 2 ? 'font-medium text-foreground' : 'text-muted-foreground')}
                  >
                    {h.text}
                  </a>
                </li>,
                stop && (
                  <li key={`stop-${stop.id}`} className="pl-3">
                    <a href={`#stop-${stop.id}`} className="flex items-center gap-1.5 font-bold text-grammar">
                      <span className={cn('size-2 rotate-45', done ? 'bg-learned' : 'border border-grammar')} />
                      Practice
                    </a>
                  </li>
                ),
              ];
            })}
            <li className="mt-2 flex flex-col gap-1">
              <a href="#next" className="font-bold">Mastery check</a>
              {progress?.learnedAt ? <Status kind="learned" /> : progress?.lastCheck ? <Status kind="in-progress" label="Not passed yet" /> : null}
            </li>
          </ol>
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
      className="my-4 flex scroll-mt-24 items-center justify-between gap-8 rounded-lg border border-border border-l-5 border-l-grammar bg-white px-6 py-5"
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
    <div id="next" className="mt-8 flex max-w-4xl scroll-mt-24 flex-col gap-5 border-t-2 border-foreground pt-6">
      <div className="flex items-center justify-between gap-8">
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
        <div className="flex flex-col gap-1.5 rounded-lg border border-border border-t-5 border-t-correction bg-white px-5 py-4">
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
    <aside className="sticky top-26 mr-10 flex w-50 shrink-0 flex-col gap-3.5">
      <Label>Contents</Label>
      <ol className="flex flex-col gap-2 text-sm">
        {unit.covers.map((c, i) => (
          <li key={c} className="text-muted-foreground">{i + 1}. {c}</li>
        ))}
      </ol>
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
