import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { setTokenProvider } from '@/engine/api'
import HydrationGuard from '@/shared/components/HydrationGuard'
import AppLayout from '@/shared/components/AppLayout'
import TodayPage from '@/features/today/TodayPage'
import LibraryPage, { ChaptersTab } from '@/features/library/LibraryPage'
import ChapterPage from '@/features/library/ChapterPage'
import GrammarPage from '@/features/grammar/GrammarPage'
import GrammarUnitPage from '@/features/grammar/GrammarUnitPage'
import ProgressPage from '@/features/progress/ProgressPage'
import LessonPage from '@/features/lesson/LessonPage'
import ReviewPage from '@/features/review/ReviewPage'
import ProfilePage from '@/features/profile/ProfilePage'
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
            <Routes>
              {/* Pages with the top bar (AppLayout hides it for immersive routes) */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<TodayPage />} />
                <Route path="/library" element={<LibraryPage />}>
                  <Route index element={<ChaptersTab />} />
                  <Route path="words" element={<WordBankPage />} />
                </Route>
                <Route path="/library/:unitId" element={<ChapterPage />} />
                <Route path="/grammar" element={<GrammarPage />} />
                <Route path="/grammar/:grammarId" element={<GrammarUnitPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/review" element={<ReviewPage />} />
              </Route>

              {/* Immersive pages */}
              <Route path="/lesson/:id" element={<LessonPage />} />
            </Routes>
          </HydrationGuard>
        </SignedIn>
      </BrowserRouter>
    </ClerkProvider>
  )
}
