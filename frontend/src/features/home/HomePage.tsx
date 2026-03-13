import StreakCalendar from '@/shared/components/StreakCalendar';
import DailySummary from './DailySummary';
import QuickActions from './QuickActions';
import ProgressOverview from './ProgressOverview';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">ItaLearn</h1>
        <p className="text-gray-500 mb-6">Your daily Italian practice</p>

        <DailySummary />
        <QuickActions />
        <ProgressOverview />
        <StreakCalendar />
      </div>
    </div>
  );
}
