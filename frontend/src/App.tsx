import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Path from '@/pages/Path'
import Lesson from '@/pages/Lesson'
import Review from '@/pages/Review'
import { seedVocabulary } from '@/stores/db'

export default function App() {
  useEffect(() => {
    seedVocabulary();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Path />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  )
}
