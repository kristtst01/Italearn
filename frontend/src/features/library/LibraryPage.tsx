import { Link, NavLink, Outlet } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { chapterProgress, chapterStatus, getChapters, recommendedChapter } from '@/engine/chapters';
import { GrammarChip, Page, PageHeader, Placeholder, SegmentBar, Status } from '@/shared/components/design';
import { grammarForChapter } from '@/data/grammarPlan';
import { grammarUnitStatus } from '@/engine/grammar';
import { cn } from '@/lib/utils';
import type { Unit } from '@/types';

function Tab({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'border-b-2 pb-1.5 text-base outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalto',
          isActive ? 'border-foreground font-bold text-foreground' : 'border-transparent font-medium text-muted-foreground hover:text-foreground',
        )
      }
    >
      {children}
    </NavLink>
  );
}

/** Library frame: header + tabs; the tab content renders in the outlet. */
export default function LibraryPage() {
  return (
    <Page
      shapes={[
        { kind: 'half', color: 'ocra', size: 260, position: { left: 400, bottom: 0 } },
        { kind: 'circle', color: 'vermiglione', size: 180, position: { right: 170, bottom: -90 } },
        { kind: 'circle', color: 'cobalto', size: 120, position: { right: 70, bottom: -60 } },
      ]}
      className="pb-40"
    >
      <PageHeader
        label={`A1 · ${getChapters().length} chapters`}
        title="Library"
        aside={
          <nav className="flex gap-7">
            <Tab to="/library">Chapters</Tab>
            <Tab to="/library/words">Words</Tab>
          </nav>
        }
      />
      <Outlet />
    </Page>
  );
}

function ChapterCard({ unit, completed, isNext }: { unit: Unit; completed: string[]; isNext: boolean }) {
  const status = chapterStatus(unit, completed);
  const pct = chapterProgress(unit, completed);
  return (
    <Link
      to={`/library/${unit.id}`}
      className={cn(
        'flex min-h-30 flex-col gap-2.5 rounded-lg bg-white px-4.5 py-4 text-foreground',
        isNext ? 'border-2 border-foreground' : 'border border-border hover:border-muted-foreground/40',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-sm text-muted-foreground">{String(unit.order).padStart(2, '0')}</span>
        <Status kind={isNext ? 'recommended' : status} />
      </div>
      <p className="text-lg font-bold leading-snug">{unit.name}</p>
      {/* Pushed to the bottom, just above the lesson count, so chips line up across cards */}
      <div className="mt-auto flex flex-wrap gap-x-3.5 gap-y-1.5">
        {grammarForChapter(unit.id).map((g) => (
          <GrammarChip key={g.id} label={g.short} status={grammarUnitStatus(g.id)} />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{unit.lessons.length} lessons</p>
      <SegmentBar learned={status === 'learned' ? 100 : 0} inProgress={status === 'in-progress' ? pct : 0} />
    </Link>
  );
}

export function ChaptersTab() {
  const completed = useProgressStore((s) => s.lessons_completed);
  const recommended = recommendedChapter(completed);
  const chapters = getChapters();
  const grid = (list: Unit[]) => (
    <div className="grid grid-cols-3 gap-3.5">
      {list.map((unit) => (
        <ChapterCard key={unit.id} unit={unit} completed={completed} isNext={unit.id === recommended?.id} />
      ))}
    </div>
  );
  const building = chapters.filter((u) => !u.ready);

  return (
    <>
      <h2 className="font-display text-heading">A1 · Breakthrough</h2>
      {grid(chapters.filter((u) => u.ready))}
      {building.length > 0 && (
        <section className="mt-6 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-heading">Under construction</h2>
            <p className="text-base text-muted-foreground">These chapters work, but are still being rewritten.</p>
          </div>
          {grid(building)}
        </section>
      )}
      <Placeholder
        className="max-w-md"
        title="Placement check"
        description="Already know some Italian? A short check marks what you know so you can skip ahead."
      />
    </>
  );
}
