import { Link } from 'react-router-dom';
import { GRAMMAR_PLAN } from '@/data/grammarPlan';
import { getChapter } from '@/engine/chapters';
import { grammarUnitStatus } from '@/engine/grammar';
import { MajolicaTile, Page, PageHeader } from '@/shared/components/design';

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
        description="Each unit covers one system of Italian grammar in a single sitting: read it, practise it, pass the check. After that it comes back in your reviews."
      />
      <ol className="flex max-w-3xl flex-col gap-2.5">
        {GRAMMAR_PLAN.map((g) => (
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
              <span className="text-xs font-bold uppercase tracking-label text-muted-foreground">Not written yet</span>
            </Link>
          </li>
        ))}
      </ol>
    </Page>
  );
}
