import { Link } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { nextLesson, recommendedChapter } from '@/engine/chapters';
import { grammarForChapter } from '@/data/grammarPlan';
import { grammarTiles, grammarUnitStatus } from '@/engine/grammar';
import { buttonVariants } from '@/components/ui/button';
import { Label, Page, PageHeader, Placeholder, Shapes, TileGrid } from '@/shared/components/design';

interface Step {
  title: string;
  detail: string;
  href: string;
}

export default function TodayPage() {
  const completed = useProgressStore((s) => s.lessons_completed);
  const dueCount = useSrsStore((s) => s.reviewableCount);

  const chapter = recommendedChapter(completed);
  const lesson = chapter ? nextLesson(chapter, completed) : undefined;
  // The first written grammar unit the chapter needs that isn't learned yet
  const grammar = chapter
    ? grammarForChapter(chapter.id).find((g) => g.ready && grammarUnitStatus(g.id) !== 'learned')
    : undefined;
  const tiles = grammarTiles();

  const steps: Step[] = [];
  if (dueCount > 0) steps.push({ title: 'Review', detail: `${dueCount} cards are due`, href: '/review' });
  if (grammar) {
    const started = grammarUnitStatus(grammar.id) === 'in-progress';
    steps.push({
      title: `Study: ${grammar.title}`,
      detail: started ? 'Carry on reading, then pass the check' : 'Read the unit, then pass the check',
      href: `/grammar/${grammar.id}`,
    });
  }
  if (chapter && lesson) {
    steps.push({
      title: `${chapter.name}: ${lesson.name}`,
      detail: chapter.can_do ?? chapter.grammar_focus,
      href: `/lesson/${lesson.id}`,
    });
  }

  const startHref = steps[0]?.href ?? '/library';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long' });

  return (
    <Page
      shapes={[
        { kind: 'half', color: 'ocra', size: 420, position: { left: -80, bottom: 0 } },
        { kind: 'circle', color: 'vermiglione', size: 260, position: { right: -90, bottom: -90 } },
      ]}
    >
      <PageHeader label={`${today} · your plan`} title="Today" />

      <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:gap-10">
        {/* Edge to edge on a phone */}
        <section className="relative isolate overflow-hidden bg-cobalto px-4 py-5.5 text-white max-sm:-mx-4 sm:px-6 sm:py-6 lg:flex-1 lg:px-8 lg:py-7">
          <Shapes
            shapes={[
              { kind: 'half', color: 'ocra', size: 200, position: { right: -40, bottom: -80 } },
              { kind: 'circle', color: 'vermiglione', size: 88, position: { right: 60, top: -40 } },
            ]}
          />
          <div className="flex flex-col gap-6">
            <p className="text-xs font-bold uppercase tracking-label text-white/75">Your session</p>
            {steps.length === 0 ? (
              <p className="text-lg font-bold">Nothing planned. Pick anything from the Library.</p>
            ) : (
              <ol className="flex flex-col gap-3.5 sm:gap-4.5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex items-baseline gap-3 sm:gap-4">
                    <span className="w-4.5 font-display text-lg text-white/60">{i + 1}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold sm:text-lg">{step.title}</span>
                      <span className="text-sm text-white/80">{step.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <div className="flex items-center gap-4.5">
              <Link to={startHref} className={buttonVariants({ size: 'xl', className: 'max-sm:w-full' })}>
                Start session
              </Link>
            </div>
          </div>
        </section>

        <aside className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-6 lg:flex lg:w-75 lg:shrink-0 lg:flex-col lg:gap-7 lg:pt-1">
          <div className="flex flex-col gap-3">
            <Label>A1 grammar</Label>
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
              <TileGrid tiles={tiles} size={30} columns={8} />
              <p className="text-sm text-muted-foreground">
                <b className="text-foreground">{tiles.filter((t) => t === 'learned').length} learned</b>
                <br className="lg:hidden" />
                <span className="max-lg:hidden"> · </span>
                {tiles.filter((t) => t === 'in-progress').length} in progress
              </p>
            </div>
          </div>
          <div className="sm:col-span-2 sm:row-start-2 lg:border-t lg:border-border lg:pt-5">
            <Placeholder title="Talk to your tutor" description="A spoken conversation, pitched at what you know." />
          </div>
          <div className="flex flex-col gap-2 max-sm:border-t max-sm:border-border max-sm:pt-4 sm:border-l sm:border-border sm:pl-6 lg:border-l-0 lg:border-t lg:pt-5 lg:pl-0">
            <Label>Or choose for yourself</Label>
            <Link to="/library" className="font-semibold text-cobalto hover:underline">Browse chapters</Link>
            <Link to="/grammar" className="font-semibold text-cobalto hover:underline">Grammar</Link>
            <Link to="/library/words" className="font-semibold text-cobalto hover:underline">Word bank</Link>
          </div>
        </aside>
      </div>
    </Page>
  );
}
