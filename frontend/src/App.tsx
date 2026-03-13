import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HydrationGuard from '@/shared/components/HydrationGuard'
import LevelUpToast from '@/shared/components/LevelUpToast'
import HomePage from '@/features/home/HomePage'
import PathPage from '@/features/path/PathPage'
import LessonPage from '@/features/lesson/LessonPage'
import ReviewPage from '@/features/review/ReviewPage'
import CheckpointPage from '@/features/checkpoint/CheckpointPage'

export default function App() {
  return (
    <BrowserRouter>
      <HydrationGuard>
        <LevelUpToast />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/path" element={<PathPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/checkpoint/:sectionId" element={<CheckpointPage />} />
        </Routes>
      </HydrationGuard>
    </BrowserRouter>
  )
}
