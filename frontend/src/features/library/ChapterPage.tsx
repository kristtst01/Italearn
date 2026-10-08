import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { getChapter, isWritingLesson, stampEarned } from '@/engine/chapters';
import { findLesson } from '@/engine/lessonRunner';
import { grammarUnitStatus } from '@/engine/grammar';
import { grammarForChapter } from '@/data/grammarPlan';
import { isGrammarUnitWritten } from '@/data/grammarLoader';
import type { Lesson, LessonMeta, LessonRole } from '@/types';
import { Label, Page, PageHeader, Placeholder, Stamp, Status } from '@/shared/components/design';
import EmptyState from '@/shared/components/EmptyState';

/** What kind of task a lesson is, so it's clear before opening it (e.g. "Exercises · 15", "Writing · 4 texts"). */
function lessonKind(meta: LessonMeta, lesson?: Lesson): { label: string; note?: string } {
  const n = lesson?.exercises.length;
  switch (meta.role) {
    case 'writing':
      return {
        label: 'Writing',
        note: 'Write your own answers and get feedback',
      };
    case 'reading':
      return {
        label: n ? `Reading · ${n} questions` : 'Reading',
        note: 'A short text, then questions on it',
      };
    case 'speaking':
      return {
        label: n ? `Speaking · ${n} ${n === 1 ? 'sentence' : 'sentences'}` : 'Speaking',
        note: 'Read aloud, with a microphone',
      };
    default:
      return { label: n ? `Exercises · ${n}` : 'Exercises' };
  }
}

function LessonCard({ meta, lesson, done }: { meta: LessonMeta; lesson?: Lesson; done: boolean }) {
  const kind = lessonKind(meta, lesson);
  return (
    <Link
      to={`/lesson/${meta.id}`}
      className="flex items-start justify-between gap-3 rounded-lg border border-border bg-white px-4.5 py-3.5 text-foreground hover:border-muted-foreground/40"
    >
      <div className="flex flex-col gap-1">
        <Label>{kind.label}</Label>
        <span className="font-bold">{meta.name}</span>
        {kind.note && <span className="text-sm text-muted-foreground">{kind.note}</span>}
      </div>
      <Status kind={done ? 'learned' : 'not-started'} label={done ? 'Done' : 'Start'} />
    </Link>
  );
}

/** Loads a chapter's lessons for their exercise counts (small, lazily loaded files). */
function useChapterLessons(ids: string[]): Record<string, Lesson> {
  const key = ids.join(',');
  const [loaded, setLoaded] = useState<{ key: string; lessons: Record<string, Lesson> }>({ key: '', lessons: {} });
  useEffect(() => {
    let cancelled = false;
    Promise.all(key.split(',').map((id) => findLesson(id))).then((lessons) => {
      if (cancelled) return;
      setLoaded({ key, lessons: Object.fromEntries(lessons.filter((l): l is Lesson => !!l).map((l) => [l.id, l])) });
    });
    return () => { cancelled = true; };
  }, [key]);
  return loaded.key === key ? loaded.lessons : {};
}

function Section({ n, title, note, children }: { n: number; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="flex items-baseline gap-3 font-bold">
        <span className="font-display text-muted-foreground">{n}</span>
        {title}
        {note && <span className="text-sm font-normal text-muted-foreground">{note}</span>}
      </h2>
      {children}
    </section>
  );
}

export default function ChapterPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const completed = useProgressStore((s) => s.lessons_completed);
  const unit = unitId ? getChapter(unitId) : undefined;
  const lessons = useChapterLessons(unit?.lessons.map((l) => l.id) ?? []);

  if (!unit) {
    return <EmptyState title="Chapter not found" message="This chapter doesn't exist." />;
  }

  const byRole = (role: LessonRole) => unit.lessons.filter((l) => l.role === role);
  // Exercise lessons (words, grammar in context, practice) share one section, in chapter order
  const exerciseLessons = unit.lessons.filter((l) => ['words', 'grammar', 'practice'].includes(l.role));
  const reading = byRole('reading');
  const writing = unit.lessons.filter(isWritingLesson);
  const speaking = byRole('speaking');
  const grammar = grammarForChapter(unit.id);
  const earned = stampEarned(unit, completed);

  const cards = (list: LessonMeta[], extra?: React.ReactNode) => (
    <div className="grid grid-cols-2 gap-2.5">
      {list.map((l) => (
        <LessonCard key={l.id} meta={l} lesson={lessons[l.id]} done={completed.includes(l.id)} />
      ))}
      {extra}
    </div>
  );
  // Silent work first; writing and speaking have their own sections, since they need time or a
  // microphone. Sections with no lessons are left out, and the rest are numbered in order.
  const sections = [
    exerciseLessons.length > 0 && { title: 'Lessons', content: cards(exerciseLessons) },
    reading.length > 0 && { title: 'Read', content: cards(reading) },
    writing.length > 0 && { title: 'Write', content: cards(writing) },
    {
      title: 'Speak & listen',
      note: 'Needs sound and a microphone',
      content: cards(
        speaking,
        <>
          <Placeholder title="Model dialogue" description="Two people in this chapter's situation, with audio and a transcript." />
          <Placeholder title="Tell the tutor" description="Practise this chapter out loud with the AI tutor." />
        </>,
      ),
    },
  ].filter((s) => s !== false);

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
          {sections.map((s, i) => (
            <Section key={s.title} n={i + 1} title={s.title} note={'note' in s ? s.note : undefined}>
              {s.content}
            </Section>
          ))}
        </div>

        <aside className="flex w-70 shrink-0 flex-col gap-3">
          <Label>Grammar this chapter uses</Label>
          {grammar.length === 0 && <p className="text-sm text-muted-foreground">{unit.grammar_focus}</p>}
          {grammar.map((g) => (
            <Link key={g.id} to={`/grammar/${g.id}`} className="flex flex-col gap-1 bg-cobalto p-4.5 text-white">
              <span className="text-xs font-bold uppercase tracking-label text-white/75">
                Grammar unit {g.order} ·{' '}
                {!isGrammarUnitWritten(g.id)
                  ? 'coming soon'
                  : { learned: 'learned', 'in-progress': 'in progress', empty: 'not started' }[grammarUnitStatus(g.id)]}
              </span>
              <span className="font-display text-xl">{g.title}</span>
            </Link>
          ))}
        </aside>
      </div>
    </Page>
  );
}
