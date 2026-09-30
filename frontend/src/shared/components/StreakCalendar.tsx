import { useMemo } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { cn } from '@/lib/utils';
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
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-white px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="flex items-baseline gap-2">
          <span className="font-display text-3xl">{currentStreak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Best: {longestStreak}</span>
          {activeToday && (
            <span className="flex items-center gap-1.5 font-bold text-foreground">
              <span className="size-2 rounded-full bg-learned" />
              Active today
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-2">
        {days.map(({ date, label }) => {
          const isActive = activeSet.has(date);
          const isToday = date === today;
          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{label}</span>
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-full text-sm font-medium',
                  isActive ? 'bg-cobalto text-white' : 'bg-vuoto text-muted-foreground',
                  isToday && 'ring-2 ring-foreground ring-offset-2',
                )}
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
