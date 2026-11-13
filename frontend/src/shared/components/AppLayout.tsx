import { Link, NavLink, Outlet } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { cn } from '@/lib/utils';
import { Logo } from './design';

const SECTIONS = [
  { to: '/', label: 'Today' },
  { to: '/library', label: 'Library' },
  { to: '/grammar', label: 'Grammar' },
  { to: '/progress', label: 'Progress' },
] as const;

function TopBar() {
  const streak = useProgressStore((s) => s.streak);
  return (
    <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-border bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-12 px-14">
        <Link to="/" className="text-foreground">
          <Logo />
        </Link>
        <nav className="flex h-full flex-1 gap-8">
          {SECTIONS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex h-full items-center border-b-3 pt-0.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-cobalto focus-visible:ring-inset',
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
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <Outlet />
    </div>
  );
}
