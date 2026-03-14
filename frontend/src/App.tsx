import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { setTokenProvider } from '@/engine/api'
import HydrationGuard from '@/shared/components/HydrationGuard'
import LevelUpToast from '@/shared/components/LevelUpToast'
import AppLayout from '@/shared/components/AppLayout'
import PathPage from '@/features/path/PathPage'
import LessonPage from '@/features/lesson/LessonPage'
import ReviewPage from '@/features/review/ReviewPage'
import CheckpointPage from '@/features/checkpoint/CheckpointPage'
import TestOutPage from '@/features/testout/TestOutPage'
import ProfilePage from '@/features/profile/ProfilePage'
import StatsPage from '@/features/stats/StatsPage'
import WordBankPage from '@/features/words/WordBankPage'
import LoginPage from '@/features/auth/LoginPage'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

/** Wires Clerk's getToken into the API client */
function TokenBridge() {
  const { getToken } = useAuth()
  useEffect(() => {
    setTokenProvider(getToken)
  }, [getToken])
  return null
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <BrowserRouter>
        <TokenBridge />

        <SignedOut>
          <LoginPage />
        </SignedOut>

        <SignedIn>
          <HydrationGuard>
            <Toaster position="top-center" richColors />
            <LevelUpToast />
            <Routes>
              {/* Tabbed pages — wrapped in AppLayout (shows nav bar) */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<PathPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/words" element={<WordBankPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Immersive pages — no nav bar */}
              <Route path="/lesson/:id" element={<LessonPage />} />
              <Route path="/checkpoint/:sectionId" element={<CheckpointPage />} />
              <Route path="/testout/:unitId" element={<TestOutPage />} />
            </Routes>
          </HydrationGuard>
        </SignedIn>
      </BrowserRouter>
    </ClerkProvider>
  )
}
