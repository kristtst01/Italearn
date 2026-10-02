import { Link } from 'react-router-dom';
import { GRAMMAR_PLAN, type PlannedGrammarUnit } from '@/data/grammarPlan';
import { getChapter } from '@/engine/chapters';
import { grammarUnitStatus } from '@/engine/grammar';
import { isGrammarUnitWritten } from '@/data/grammarLoader';
import { MajolicaTile, Page, PageHeader, Status } from '@/shared/components/design';

const TILE_TO_STATUS = { learned: 'learned', 'in-progress': 'in-progress', empty: 'not-started' } as const;

function list(units: PlannedGrammarUnit[]) {
  return (
    <ol className="flex max-w-3xl flex-col gap-2.5">
      {units.map((g) => (
        <li key={g.id}>
          <Link
            to={`/grammar/${g.id}`}
            className="flex items-center gap-5 rounded-lg border border-border bg-white px-5 py-4 text-foreground hover:border-muted-foreground/40"
          >
            <MajolicaTile status={grammarUnitStatus(g.id)} size={40} />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-display text-sm text-muted-foreground">{String(g.order).padStart(2, '0')}</span>
              <span className="text-lg font-bold">{g.title}</span>
              <span className="text-sm text-muted-foreground">
                Used in {g.chapters.map((c) => getChapter(c)?.name).filter(Boolean).join(', ')}
              </span>
            </div>
            {isGrammarUnitWritten(g.id) ? (
              <Status kind={TILE_TO_STATUS[grammarUnitStatus(g.id)]} />
            ) : (
              <span className="text-xs font-bold uppercase tracking-label text-muted-foreground">Not written yet</span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default function GrammarPage() {
  return (
    <Page
      shapes={[
        { kind: 'circle', color: 'vermiglione', size: 260, position: { right: -110, top: 110 } },
        { kind: 'half', color: 'ocra', size: 300, position: { right: -80, bottom: 0 } },
      ]}
      className="pb-24"
    >
      <PageHeader
        label={`A1 · ${GRAMMAR_PLAN.length} units`}
        title="Grammar"
        description="Each unit covers one system of Italian grammar: read it, practise it as you go, then pass the check."
      />
      {list(GRAMMAR_PLAN.filter((g) => g.ready))}
      {GRAMMAR_PLAN.some((g) => !g.ready) && (
        <section className="mt-6 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-heading">Under construction</h2>
            <p className="text-base text-muted-foreground">Units still being written. Unwritten ones show what they will cover.</p>
          </div>
          {list(GRAMMAR_PLAN.filter((g) => !g.ready))}
        </section>
      )}
    </Page>
  );
}
