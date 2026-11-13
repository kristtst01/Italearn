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

      <div className="flex items-start gap-10">
        <section className="relative isolate flex-1 overflow-hidden bg-cobalto px-8 py-7 text-white">
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
              <ol className="flex flex-col gap-4.5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex items-baseline gap-4">
                    <span className="w-4.5 font-display text-lg text-white/60">{i + 1}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-lg font-bold">{step.title}</span>
                      <span className="text-sm text-white/80">{step.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <div className="flex items-center gap-4.5">
              <Link to={startHref} className={buttonVariants({ size: 'xl' })}>
                Start session
              </Link>
            </div>
          </div>
        </section>

        <aside className="flex w-75 shrink-0 flex-col gap-7 pt-1">
          <div className="flex flex-col gap-3">
            <Label>A1 grammar</Label>
            <div className="flex items-center gap-3.5">
              <TileGrid tiles={tiles} size={36} columns={8} />
              <p className="text-sm text-muted-foreground">
                <b className="text-foreground">{tiles.filter((t) => t === 'learned').length} learned</b>
                <br />
                {tiles.filter((t) => t === 'in-progress').length} in progress
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-5">
            <Placeholder title="Talk to your tutor" description="A spoken conversation, pitched at what you know." />
          </div>
          <div className="flex flex-col gap-2 border-t border-border pt-5">
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
