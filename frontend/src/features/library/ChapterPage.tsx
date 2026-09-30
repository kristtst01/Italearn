import { Link, useParams } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { getChapter, isWritingLesson, stampEarned } from '@/engine/chapters';
import { grammarForChapter } from '@/data/grammarPlan';
import type { LessonMeta, LessonRole } from '@/types';
import { Label, Page, PageHeader, Placeholder, Stamp, Status } from '@/shared/components/design';
import EmptyState from '@/shared/components/EmptyState';

function LessonCard({ lesson, done }: { lesson: LessonMeta; done: boolean }) {
  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white px-4.5 py-3.5 text-foreground hover:border-muted-foreground/40"
    >
      <span className="font-bold">{lesson.name}</span>
      <Status kind={done ? 'learned' : 'not-started'} label={done ? 'Done' : 'Start'} />
    </Link>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="flex items-baseline gap-3 font-bold">
        <span className="font-display text-muted-foreground">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ChapterPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const completed = useProgressStore((s) => s.lessons_completed);
  const unit = unitId ? getChapter(unitId) : undefined;

  if (!unit) {
    return <EmptyState title="Chapter not found" message="This chapter doesn't exist." />;
  }

  const byRole = (role: LessonRole) => unit.lessons.filter((l) => l.role === role);
  const words = byRole('words');
  const grammarLessons = byRole('grammar');
  const useIt = [...byRole('practice'), ...unit.lessons.filter(isWritingLesson)];
  const grammar = grammarForChapter(unit.id);
  const earned = stampEarned(unit, completed);

  return (
    <Page
      shapes={[
        { kind: 'circle', color: 'cobalto', size: 200, position: { left: -90, bottom: -60 } },
        { kind: 'half', color: 'vermiglione', size: 240, position: { right: 220, bottom: 0 } },
      ]}
      className="pb-36"
    >
      <Link to="/library" className="text-sm font-bold text-cobalto">‹ Library</Link>
      <PageHeader
        label={`Chapter ${String(unit.order).padStart(2, '0')} · A1`}
        title={unit.name}
        description={unit.can_do ?? unit.grammar_focus}
        aside={
          <div className="flex flex-col items-center gap-1.5">
            <Stamp title={unit.stamp_title ?? unit.name} caption={`A1 · ${unit.name}`} earned={earned} />
            <span className="text-xs text-muted-foreground">{earned ? 'Stamp earned' : 'Earn this stamp'}</span>
          </div>
        }
      />

      <div className="flex items-start gap-10">
        <div className="flex flex-1 flex-col gap-6">
          <Section n={1} title="Listen first">
            <Placeholder title="Model dialogue" description="Two people in this chapter's situation, with audio and a transcript." />
          </Section>
          {words.length > 0 && (
            <Section n={2} title="Words">
              <div className="grid grid-cols-2 gap-2.5">
                {words.map((l) => (
                  <LessonCard key={l.id} lesson={l} done={completed.includes(l.id)} />
                ))}
              </div>
            </Section>
          )}
          {grammarLessons.length > 0 && (
            <Section n={words.length > 0 ? 3 : 2} title="Grammar in context">
              <div className="grid grid-cols-2 gap-2.5">
                {grammarLessons.map((l) => (
                  <LessonCard key={l.id} lesson={l} done={completed.includes(l.id)} />
                ))}
              </div>
            </Section>
          )}
          <Section n={2 + (words.length > 0 ? 1 : 0) + (grammarLessons.length > 0 ? 1 : 0)} title="Use it">
            <div className="grid grid-cols-2 gap-2.5">
              {useIt.map((l) => (
                <LessonCard key={l.id} lesson={l} done={completed.includes(l.id)} />
              ))}
              <Placeholder title="Tell the tutor" description="Practise this chapter out loud with the AI tutor." />
            </div>
          </Section>
        </div>

        <aside className="flex w-70 shrink-0 flex-col gap-3">
          <Label>Grammar this chapter uses</Label>
          {grammar.length === 0 && <p className="text-sm text-muted-foreground">{unit.grammar_focus}</p>}
          {grammar.map((g) => (
            <Link key={g.id} to={`/grammar/${g.id}`} className="flex flex-col gap-1 bg-cobalto p-4.5 text-white">
              <span className="text-xs font-bold uppercase tracking-label text-white/75">Grammar unit · coming soon</span>
              <span className="font-display text-xl">{g.title}</span>
            </Link>
          ))}
        </aside>
      </div>
    </Page>
  );
}
