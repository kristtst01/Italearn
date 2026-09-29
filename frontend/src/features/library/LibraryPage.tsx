import { Link, NavLink, Outlet } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { chapterProgress, chapterStatus, getChapters, recommendedChapter } from '@/engine/chapters';
import { Page, PageHeader, Placeholder, SegmentBar, Status } from '@/shared/components/design';
import { cn } from '@/lib/utils';

function Tab({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'border-b-2 pb-1.5 text-base',
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

export function ChaptersTab() {
  const completed = useProgressStore((s) => s.lessons_completed);
  const recommended = recommendedChapter(completed);

  return (
    <>
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-heading">A1 · Breakthrough</h2>
        <p className="text-sm text-muted-foreground">Everything is open. Chapters show what they build on.</p>
      </div>
      <div className="grid grid-cols-3 gap-3.5">
        {getChapters().map((unit) => {
          const status = chapterStatus(unit, completed);
          const isNext = unit.id === recommended?.id;
          const pct = chapterProgress(unit, completed);
          return (
            <Link
              key={unit.id}
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
              <p className="flex-1 text-lg font-bold leading-snug">{unit.name}</p>
              <p className="text-sm text-muted-foreground">{unit.lessons.length} lessons</p>
              <SegmentBar learned={status === 'learned' ? 100 : 0} inProgress={status === 'in-progress' ? pct : 0} />
            </Link>
          );
        })}
      </div>
      <Placeholder
        className="max-w-md"
        title="Placement check"
        description="Already know some Italian? A short check marks what you know so you can skip ahead."
      />
    </>
  );
}
