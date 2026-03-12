import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HydrationGuard from '@/shared/components/HydrationGuard'
import PathPage from '@/features/path/PathPage'
import LessonPage from '@/features/lesson/LessonPage'
import ReviewPage from '@/features/review/ReviewPage'

export default function App() {
  return (
    <BrowserRouter>
      <HydrationGuard>
        <Routes>
          <Route path="/" element={<PathPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </HydrationGuard>
    </BrowserRouter>
  )
}
