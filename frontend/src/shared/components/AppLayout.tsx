import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { BookOpen, RotateCcw, Library, BarChart3, User } from 'lucide-react';
import { useSrsStore } from '@/stores/srsStore';

const TABS = [
  { to: '/', icon: BookOpen, label: 'Learn' },
  { to: '/review', icon: RotateCcw, label: 'Review' },
  { to: '/words', icon: Library, label: 'Words' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/profile', icon: User, label: 'Profile' },
] as const;

const REVIEW_BATCH_SIZE = 20;

/** Routes where the tab bar should be hidden (immersive screens). */
const IMMERSIVE_PREFIXES = ['/lesson/', '/testout/'];

export default function AppLayout() {
  const { pathname } = useLocation();
  const hideNav = IMMERSIVE_PREFIXES.some((p) => pathname.startsWith(p));
  const reviewableCount = useSrsStore((s) => s.reviewableCount);
  const showReviewDot = reviewableCount >= REVIEW_BATCH_SIZE;

  if (hideNav) return <Outlet />;

  return (
    <div className="min-h-screen pb-16 md:pb-0 md:pl-20">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center gap-1 pt-6 bg-white border-r border-gray-200 z-50">
        {TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl text-[10px] font-medium transition-colors w-16 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <span className="relative">
              <Icon className="w-5 h-5" />
              {to === '/review' && showReviewDot && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white border-t border-gray-200 z-50 h-16 safe-bottom">
        {TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`
            }
          >
            <span className="relative">
              <Icon className="w-5 h-5" />
              {to === '/review' && showReviewDot && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
