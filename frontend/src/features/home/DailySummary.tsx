import { useEffect, useState } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { isActiveToday } from '@/engine/streak';
import { db } from '@/stores/db';

export default function DailySummary() {
  const streak = useProgressStore((s) => s.streak);
  const streakDates = useProgressStore((s) => s.streak_dates);
  const dueCount = useSrsStore((s) => s.reviewableCount);
  const [todayXP, setTodayXP] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    db.xpLog.get(today).then((entry) => {
      if (entry) setTodayXP(entry.xp);
    });
  }, []);

  const activeToday = isActiveToday(streakDates);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {/* Streak */}
      <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
        <p className="text-3xl font-bold text-gray-900">{streak}</p>
        <p className="text-xs text-gray-500 mt-1">day streak</p>
        {activeToday && (
          <span className="inline-block mt-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
            Active today
          </span>
        )}
      </div>

      {/* Today's XP */}
      <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
        <p className="text-3xl font-bold text-amber-600">{todayXP}</p>
        <p className="text-xs text-gray-500 mt-1">XP today</p>
      </div>

      {/* Cards due */}
      <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
        <p className={`text-3xl font-bold ${dueCount > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
          {dueCount}
        </p>
        <p className="text-xs text-gray-500 mt-1">cards due</p>
      </div>
    </div>
  );
}
