import type { ComponentType, SVGProps } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, ChartNoAxesColumn, Flame, House, UserRound } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { cn } from '@/lib/utils';
import { Logo } from './design';

/** The majolica tile as a line icon: grammar's symbol across the app. */
function TileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16v16H4zM12 6.5 17.5 12 12 17.5 6.5 12zM12 12h.01" />
    </svg>
  );
}

const SECTIONS: { to: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { to: '/', label: 'Today', icon: House },
  { to: '/library', label: 'Library', icon: BookOpen },
  { to: '/grammar', label: 'Grammar', icon: TileIcon },
  { to: '/progress', label: 'Progress', icon: ChartNoAxesColumn },
];

/** Section links in the top bar, from half-screen width up. */
function TopNav() {
  return (
    <nav className="flex h-full flex-1 gap-5 max-sm:hidden lg:gap-8">
      {SECTIONS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex h-full items-center border-b-3 pt-0.5 text-[0.9375rem] outline-none focus-visible:ring-2 focus-visible:ring-cobalto focus-visible:ring-inset lg:text-base',
              isActive
                ? 'border-vermiglione font-bold text-foreground'
                : 'border-transparent font-medium text-muted-foreground hover:text-foreground',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Section tabs at the bottom of the screen, in the phone layout. */
function BottomNav() {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      {SECTIONS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex h-15 flex-col items-center justify-center gap-0.5 text-[0.6875rem] outline-none focus-visible:ring-2 focus-visible:ring-cobalto focus-visible:ring-inset',
              isActive ? 'font-bold text-foreground shadow-[inset_0_3px_0] shadow-vermiglione' : 'font-medium text-muted-foreground',
            )
          }
        >
          <Icon className="size-5.5" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function TopBar() {
  const streak = useProgressStore((s) => s.streak);
  return (
    <header className="sticky top-0 z-40 h-13 shrink-0 border-b border-border bg-white sm:h-14 lg:h-16">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:gap-12 lg:px-14">
        <Link to="/" className="text-foreground">
          <Logo />
        </Link>
        <TopNav />
        <div className="flex items-center gap-3 text-sm text-muted-foreground lg:gap-6">
          <span className="max-lg:hidden">A1{streak > 0 && ` · ${streak}-day streak`}</span>
          {/* Narrower, just the number: the top bar also holds the section links, and streaks get long */}
          {streak > 0 && (
            <span
              title={`${streak}-day streak`}
              aria-label={`${streak}-day streak`}
              className="flex items-center gap-1 font-bold text-foreground tabular-nums lg:hidden"
            >
              <Flame className="size-4 text-vermiglione" aria-hidden />
              {streak.toLocaleString('en-GB')}
            </span>
          )}
          <Link to="/profile" className="font-medium text-muted-foreground hover:text-foreground max-lg:hidden">
            Profile
          </Link>
          <Link
            to="/profile"
            aria-label="Profile"
            className="-mr-2 flex size-11 items-center justify-center rounded-full lg:hidden"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-cobalto text-white">
              <UserRound className="size-4.5" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col max-sm:pb-[calc(3.75rem+env(safe-area-inset-bottom))]">
      <TopBar />
      <Outlet />
      <BottomNav />
    </div>
  );
}
