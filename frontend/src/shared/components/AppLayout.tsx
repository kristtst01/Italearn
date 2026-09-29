import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { to: '/', label: 'Today' },
  { to: '/library', label: 'Library' },
  { to: '/grammar', label: 'Grammar' },
  { to: '/progress', label: 'Progress' },
] as const;

/** Routes that take over the whole screen (no top bar). */
const IMMERSIVE_PREFIXES = ['/lesson/', '/review'];

function Logo() {
  return (
    <span aria-hidden className="flex items-end">
      <span className="size-4.5 rounded-full bg-vermiglione" />
      <span className="-ml-1.5 h-2.25 w-4.5 rounded-t-full bg-ocra" />
    </span>
  );
}

function TopBar() {
  const streak = useProgressStore((s) => s.streak);
  return (
    <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-border bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-12 px-14">
        <Link to="/" className="flex items-center gap-2.5 text-foreground">
          <Logo />
          <span className="font-display text-xl">ItaLearn</span>
        </Link>
        <nav className="flex h-full flex-1 gap-8">
          {SECTIONS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex h-full items-center border-b-3 pt-0.5 text-base',
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
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>A1{streak > 0 && ` · ${streak}-day streak`}</span>
          <Link to="/profile" className="font-medium text-muted-foreground hover:text-foreground">
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function AppLayout() {
  const { pathname } = useLocation();
  if (IMMERSIVE_PREFIXES.some((p) => pathname.startsWith(p))) return <Outlet />;

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <Outlet />
    </div>
  );
}
