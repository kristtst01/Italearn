import { useMemo } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { getCurrentStreak, getLongestStreak, isActiveToday, todayDateString } from '@/engine/streak';

function getLast30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function StreakCalendar() {
  const streakDates = useProgressStore((s) => s.streak_dates);

  const days = useMemo(() => getLast30Days(), []);
  const activeSet = useMemo(() => new Set(streakDates), [streakDates]);
  const currentStreak = useMemo(() => getCurrentStreak(streakDates), [streakDates]);
  const longestStreak = useMemo(() => getLongestStreak(streakDates), [streakDates]);
  const activeToday = useMemo(() => isActiveToday(streakDates), [streakDates]);
  const today = todayDateString();

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 mb-6">
      {/* Stats row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">{currentStreak}</span>
          <span className="text-sm text-gray-500">day streak</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Best: {longestStreak}</span>
          {activeToday && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Active today
            </span>
          )}
        </div>
      </div>

      {/* Day-of-week headers — aligned to the grid's starting weekday */}
      {(() => {
        const firstDay = new Date(days[0] + 'T00:00:00');
        // JS getDay: 0=Sun, convert to Mon-based: 0=Mon
        const startDow = (firstDay.getDay() + 6) % 7;
        const labels = [];
        for (let i = 0; i < 7; i++) {
          labels.push(DAY_LABELS[(startDow + i) % 7]);
        }
        return (
          <div className="grid grid-cols-7 gap-1 mb-1">
            {labels.map((label, i) => (
              <div key={i} className="text-center text-[10px] text-gray-400">
                {label}
              </div>
            ))}
          </div>
        );
      })()}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isActive = activeSet.has(day);
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium ${
                isActive
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              } ${isToday ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
              title={day}
            >
              {new Date(day + 'T00:00:00').getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
