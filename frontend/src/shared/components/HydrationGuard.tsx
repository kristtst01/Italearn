import { useEffect, type ReactNode } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { seedVocabulary } from '@/engine/vocabCache';
import LoadingScreen from './LoadingScreen';

export default function HydrationGuard({ children }: { children: ReactNode }) {
  const progressHydrated = useProgressStore((s) => s.hydrated);
  const hydrateProgress = useProgressStore((s) => s.hydrate);
  const srsHydrated = useSrsStore((s) => s.hydrated);
  const hydrateSrs = useSrsStore((s) => s.hydrate);

  useEffect(() => {
    async function init() {
      await seedVocabulary();
      if (!progressHydrated) hydrateProgress();
      if (!srsHydrated) hydrateSrs();
    }
    init();
  }, [progressHydrated, hydrateProgress, srsHydrated, hydrateSrs]);

  if (!progressHydrated || !srsHydrated) {
    return <LoadingScreen />;
  }

  return children;
}
