import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import HydrationGuard from '@/shared/components/HydrationGuard'
import LevelUpToast from '@/shared/components/LevelUpToast'
import PathPage from '@/features/path/PathPage'
import LessonPage from '@/features/lesson/LessonPage'
import ReviewPage from '@/features/review/ReviewPage'
import CheckpointPage from '@/features/checkpoint/CheckpointPage'
import TestOutPage from '@/features/testout/TestOutPage'
import ProfilePage from '@/features/profile/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <HydrationGuard>
        <Toaster position="top-center" richColors />
        <LevelUpToast />
        <Routes>
          <Route path="/" element={<PathPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/checkpoint/:sectionId" element={<CheckpointPage />} />
          <Route path="/testout/:unitId" element={<TestOutPage />} />
        </Routes>
      </HydrationGuard>
    </BrowserRouter>
  )
}
