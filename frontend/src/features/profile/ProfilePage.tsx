import { useState, useMemo } from 'react';
import { TriangleAlert } from 'lucide-react';
import StreakCalendar from '@/shared/components/StreakCalendar';
import ProgressBar from '@/shared/components/ProgressBar';
import { useProgressStore } from '@/stores/progressStore';
import { getLevel } from '@/engine/xp';

export default function ProfilePage() {
  const xp = useProgressStore((s) => s.xp);
  const badges = useProgressStore((s) => s.badges);
  const [confirmReset, setConfirmReset] = useState(false);

  const levelInfo = useMemo(() => getLevel(xp), [xp]);
  const xpInLevel = levelInfo.currentXP - levelInfo.currentThreshold;
  const xpNeeded = levelInfo.nextThreshold - levelInfo.currentThreshold;
  const levelProgress = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 100;

  async function handleReset() {
    // TODO: add a DELETE /api/v1/progress/reset endpoint for full server-side reset
    setConfirmReset(false);
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

        {/* Level & rank card */}
        <div className="rounded-xl bg-white border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Level {levelInfo.level}</p>
              <p className="text-lg font-bold text-gray-900">{levelInfo.rank}</p>
            </div>
            <p className="text-sm text-gray-500">{xp.toLocaleString()} XP</p>
          </div>
          <div className="mb-1">
            <ProgressBar progress={levelProgress} />
          </div>
          <p className="text-xs text-gray-400">
            {xpNeeded > 0
              ? `${xpInLevel} / ${xpNeeded} XP to level ${levelInfo.level + 1}`
              : 'Max level reached'}
          </p>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="rounded-xl bg-white border border-gray-200 p-4 mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Badges</p>
            <div className="flex items-center gap-2">
              {badges.map((b) => (
                <span key={b.sectionId} className="text-2xl" title={`Section: ${b.sectionId}`}>
                  ⭐
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Streak calendar */}
        <StreakCalendar />

        {/* Reset progress */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Reset all progress
            </button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <TriangleAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Are you sure?</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    This will permanently delete all your lessons, XP, streaks, SRS cards, and scores. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Yes, reset everything
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
