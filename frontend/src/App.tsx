import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
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

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
