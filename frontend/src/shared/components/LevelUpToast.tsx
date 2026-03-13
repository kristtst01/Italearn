import { useEffect } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { getLevel } from '@/engine/xp';

export default function LevelUpToast() {
  const previousLevel = useProgressStore((s) => s.previousLevel);
  const xp = useProgressStore((s) => s.xp);
  const clearLevelUp = useProgressStore((s) => s.clearLevelUp);

  useEffect(() => {
    if (previousLevel === null) return;
    const timer = setTimeout(() => {
      clearLevelUp();
    }, 3000);
    return () => clearTimeout(timer);
  }, [previousLevel, clearLevelUp]);

  if (previousLevel === null) return null;

  const { level, rank } = getLevel(xp);

  return (
    <div className="fixed inset-x-0 top-6 z-50 flex justify-center pointer-events-none animate-bounce">
      <div className="pointer-events-auto rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-4 shadow-lg">
        <div className="text-center">
          <p className="text-sm font-medium text-amber-900">Level Up!</p>
          <p className="text-2xl font-bold text-white">
            Level {level} — {rank}
          </p>
        </div>
      </div>
    </div>
  );
}
