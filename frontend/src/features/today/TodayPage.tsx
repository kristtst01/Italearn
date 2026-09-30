import { Link } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { nextLesson, recommendedChapter } from '@/engine/chapters';
import { grammarForChapter } from '@/data/grammarPlan';
import { grammarTiles } from '@/engine/grammar';
import { buttonVariants } from '@/components/ui/button';
import { Label, Page, PageHeader, Placeholder, TileGrid } from '@/shared/components/design';

interface Step {
  title: string;
  detail: string;
  soon?: boolean;
}

export default function TodayPage() {
  const completed = useProgressStore((s) => s.lessons_completed);
  const dueCount = useSrsStore((s) => s.reviewableCount);

  const chapter = recommendedChapter(completed);
  const lesson = chapter ? nextLesson(chapter, completed) : undefined;
  const grammar = chapter ? grammarForChapter(chapter.id)[0] : undefined;

  const steps: Step[] = [];
  if (dueCount > 0) steps.push({ title: 'Review', detail: `${dueCount} cards are due` });
  if (grammar) steps.push({ title: `Study: ${grammar.title}`, detail: 'Grammar units are coming soon', soon: true });
  if (chapter && lesson) steps.push({ title: `${chapter.name}: ${lesson.name}`, detail: chapter.can_do ?? chapter.grammar_focus });

  const startHref = dueCount > 0 ? '/review' : lesson ? `/lesson/${lesson.id}` : '/library';
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
        <section className="relative flex-1 overflow-hidden bg-cobalto px-8 py-7 text-white">
          <div aria-hidden className="absolute -right-10 -bottom-20 h-25 w-50 rounded-t-full bg-ocra" />
          <div aria-hidden className="absolute -top-10 right-15 size-22 rounded-full bg-vermiglione" />
          <div className="relative flex flex-col gap-6">
            <p className="text-xs font-bold uppercase tracking-label text-white/75">Your session</p>
            {steps.length === 0 ? (
              <p className="text-lg font-bold">Nothing planned. Pick anything from the Library.</p>
            ) : (
              <ol className="flex flex-col gap-4.5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex items-baseline gap-4">
                    <span className="w-4.5 font-display text-lg text-white/60">{i + 1}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-lg font-bold">
                        {step.title}
                        {step.soon && (
                          <span className="ml-2 rounded-full border border-white/50 px-2 py-0.5 align-middle text-xs font-bold uppercase tracking-label">
                            Soon
                          </span>
                        )}
                      </span>
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
              {chapter && grammar && (
                <p className="max-w-sm text-sm text-white/80">
                  Why this next? {chapter.name} uses {grammar.title.toLowerCase()}.
                </p>
              )}
            </div>
          </div>
        </section>

        <aside className="flex w-75 shrink-0 flex-col gap-7 pt-1">
          <div className="flex flex-col gap-3">
            <Label>A1 grammar</Label>
            <div className="flex items-center gap-3.5">
              <TileGrid tiles={grammarTiles()} size={36} />
              <p className="text-sm text-muted-foreground">
                <b className="text-foreground">0 learned</b>
                <br />
                Units coming soon
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
