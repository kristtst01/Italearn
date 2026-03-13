import { useMemo } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { getCurrentStreak, getLongestStreak, isActiveToday, todayDateString } from '@/engine/streak';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getLast7Days(): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = (d.getDay() + 6) % 7; // Mon=0
    days.push({ date: d.toISOString().slice(0, 10), label: DAY_LABELS[dow] });
  }
  return days;
}

export default function StreakCalendar() {
  const streakDates = useProgressStore((s) => s.streak_dates);

  const days = useMemo(() => getLast7Days(), []);
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

      {/* Last 7 days */}
      <div className="flex justify-between gap-2">
        {days.map(({ date, label }) => {
          const isActive = activeSet.has(date);
          const isToday = date === today;
          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400">{label}</span>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium ${
                  isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                } ${isToday ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                title={date}
              >
                {new Date(date + 'T00:00:00').getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
