import { useEffect } from 'react';
import { toast } from 'sonner';
import { useProgressStore } from '@/stores/progressStore';
import { getLevel } from '@/engine/xp';

export default function LevelUpToast() {
  const previousLevel = useProgressStore((s) => s.previousLevel);
  const xp = useProgressStore((s) => s.xp);
  const clearLevelUp = useProgressStore((s) => s.clearLevelUp);

  useEffect(() => {
    if (previousLevel === null) return;

    const { level, rank } = getLevel(xp);
    toast.success(`Level ${level} — ${rank}`, {
      description: 'Level Up!',
      duration: 3000,
    });
    clearLevelUp();
  }, [previousLevel, xp, clearLevelUp]);

  return null;
}
