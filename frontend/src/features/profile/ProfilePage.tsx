import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StreakCalendar from '@/shared/components/StreakCalendar';
import DailySummary from './DailySummary';
import ProgressOverview from './ProgressOverview';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to path
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-gray-500 mb-6">Your progress & stats</p>

        <DailySummary />
        <ProgressOverview />
        <StreakCalendar />
      </div>
    </div>
  );
}
