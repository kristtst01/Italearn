import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { seedVocabulary } from '@/engine/vocabCache';
import LoadingScreen from './LoadingScreen';

export default function HydrationGuard({ children }: { children: ReactNode }) {
  const { isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const progressHydrated = useProgressStore((s) => s.hydrated);
  const hydrateProgress = useProgressStore((s) => s.hydrate);
  const srsHydrated = useSrsStore((s) => s.hydrated);
  const hydrateSrs = useSrsStore((s) => s.hydrate);

  useEffect(() => {
    if (!clerkLoaded || !isSignedIn) return;

    async function init() {
      await seedVocabulary();
      if (!progressHydrated) hydrateProgress();
      if (!srsHydrated) hydrateSrs();
    }
    init();
  }, [clerkLoaded, isSignedIn, progressHydrated, hydrateProgress, srsHydrated, hydrateSrs]);

  if (!clerkLoaded || !progressHydrated || !srsHydrated) {
    return <LoadingScreen />;
  }

  return children;
}
