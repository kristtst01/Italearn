import { Link, useParams } from 'react-router-dom';
import { GRAMMAR_PLAN, getPlannedGrammarUnit } from '@/data/grammarPlan';
import { getChapter } from '@/engine/chapters';
import { Label, Page, Placeholder } from '@/shared/components/design';
import EmptyState from '@/shared/components/EmptyState';

/**
 * A grammar unit: study → practice → mastery check on one page.
 * No unit is written yet, so this shows the layout with the planned outline.
 */
export default function GrammarUnitPage() {
  const { grammarId } = useParams<{ grammarId: string }>();
  const unit = grammarId ? getPlannedGrammarUnit(grammarId) : undefined;
  if (!unit) return <EmptyState title="Grammar unit not found" message="This grammar unit doesn't exist." />;

  return (
    <Page
      shapes={[
        { kind: 'circle', color: 'vermiglione', size: 260, position: { right: -110, top: 110 } },
        { kind: 'half', color: 'ocra', size: 300, position: { right: -80, top: 900 } },
      ]}
      className="flex-row items-start gap-12 pb-24"
    >
      <aside className="sticky top-26 flex w-50 shrink-0 flex-col gap-3.5">
        <Link to="/grammar" className="text-sm font-bold text-cobalto">‹ Grammar</Link>
        <Label className="mt-2.5">Contents</Label>
        <ol className="flex flex-col gap-2 text-sm">
          <li className="font-bold">Part 1 · Study</li>
          {unit.covers.map((c, i) => (
            <li key={c} className="text-muted-foreground">{i + 1}. {c}</li>
          ))}
          <li className="mt-2 font-bold">Part 2 · Practice</li>
          <li className="font-bold">Part 3 · Mastery check</li>
        </ol>
        <div className="mt-3.5 flex flex-col gap-1.5 border-t border-border pt-3.5 text-sm text-muted-foreground">
          <span>Used in: {unit.chapters.map((c) => getChapter(c)?.name).filter(Boolean).join(', ')}</span>
        </div>
      </aside>

      <article className="flex max-w-175 flex-1 flex-col gap-5.5 text-reading">
        <div className="flex flex-col gap-1.5">
          <Label>A1 grammar · Unit {unit.order} of {GRAMMAR_PLAN.length}</Label>
          <h1 className="font-display text-title">{unit.title}</h1>
        </div>
        <Placeholder
          label="Not written yet"
          title="This unit's explanation is coming"
          description="A full, textbook-depth explanation of every form, rule and exception at A1, with tables and typical mistakes. It will cover:"
        >
          <ul className="mt-1.5 list-disc pl-5 text-sm text-muted-foreground">
            {unit.covers.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Placeholder>

        <div className="mt-5 flex flex-col gap-3.5 border-t-2 border-foreground pt-5.5">
          <h2 className="font-display text-heading">Part 2 · Practice</h2>
          <p className="text-base text-muted-foreground">Done in the same sitting, from recognizing the forms to producing them.</p>
          <div className="grid grid-cols-2 gap-2.5">
            <Placeholder title="Whose is it?" description="Structured input: attend to the form to get the meaning." />
            <Placeholder title="Transform" description="Rewrite for another person, number or gender." />
            <Placeholder title="Fix the mistake" description="Spot the typical English-speaker error." />
            <Placeholder title="Translate" description="Full sentences from English into Italian." />
          </div>
          <h2 className="mt-2.5 font-display text-heading">Part 3 · Mastery check</h2>
          <p className="text-base text-muted-foreground">
            Mixed questions without the notes. Pass it and the unit enters your reviews. Miss a section and you're sent back to it.
          </p>
        </div>
      </article>
    </Page>
  );
}
