import { useMemo } from 'react';
import { curriculum } from '@/data/curriculum';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { getLevel } from '@/engine/xp';
import ProgressBar from '@/shared/components/ProgressBar';

export default function ProgressOverview() {
  const xp = useProgressStore((s) => s.xp);
  const lessonsCompleted = useProgressStore((s) => s.lessons_completed);
  const badges = useProgressStore((s) => s.badges);
  const unitMastery = useSrsStore((s) => s.unitMastery);

  const levelInfo = useMemo(() => getLevel(xp), [xp]);

  const xpInLevel = levelInfo.currentXP - levelInfo.currentThreshold;
  const xpNeeded = levelInfo.nextThreshold - levelInfo.currentThreshold;
  const levelProgress = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 100;

  // Find completed units that have mastery data
  const completedUnits = useMemo(() => {
    const completed = new Set(lessonsCompleted);
    const units: { id: string; name: string; mastery: number }[] = [];

    for (const section of curriculum.sections) {
      for (const unit of section.units) {
        if (unit.lessons.length === 0) continue;
        const allDone = unit.lessons.every((l) => completed.has(l.id));
        if (!allDone) continue;

        const mastery = unitMastery[unit.id] ?? 0;
        units.push({ id: unit.id, name: unit.name, mastery });
      }
    }
    return units;
  }, [lessonsCompleted, unitMastery]);

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 mb-6">
      {/* Level & XP */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-gray-500">Level {levelInfo.level}</p>
          <p className="text-lg font-bold text-gray-900">{levelInfo.rank}</p>
        </div>
        <p className="text-sm text-gray-500">{xp.toLocaleString()} XP total</p>
      </div>

      <div className="mb-1">
        <ProgressBar progress={levelProgress} />
      </div>
      <p className="text-xs text-gray-400 mb-4">
        {xpNeeded > 0
          ? `${xpInLevel} / ${xpNeeded} XP to level ${levelInfo.level + 1}`
          : 'Max level reached'}
      </p>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {badges.map((b) => (
            <span key={b.sectionId} className="text-lg" title={`Section badge: ${b.sectionId}`}>
              ⭐
            </span>
          ))}
        </div>
      )}

      {/* Unit mastery bars */}
      {completedUnits.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Unit Mastery
          </p>
          <div className="space-y-2">
            {completedUnits.map((unit) => (
              <div key={unit.id}>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs text-gray-700 truncate mr-2">{unit.name}</p>
                  <p className="text-xs text-gray-500 shrink-0">{unit.mastery}%</p>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      unit.mastery >= 80
                        ? 'bg-green-500'
                        : unit.mastery >= 50
                          ? 'bg-amber-500'
                          : 'bg-red-400'
                    }`}
                    style={{ width: `${unit.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
