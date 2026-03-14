import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BookOpen, RotateCcw, Flame, Trophy, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { db } from '@/stores/db';
import { getLevel } from '@/engine/xp';
import { getLongestStreak } from '@/engine/streak';

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`rounded-xl p-2.5 ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
          {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsPage() {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const streakDates = useProgressStore((s) => s.streak_dates);
  const lessonsCompleted = useProgressStore((s) => s.lessons_completed);
  const dailyActivity = useProgressStore((s) => s.daily_activity);
  const unitMastery = useSrsStore((s) => s.unitMastery);

  const levelInfo = getLevel(xp);
  const longestStreak = getLongestStreak(streakDates);

  const [wordsData, setWordsData] = useState<{ total: number; recent: number; perDay: Record<string, number> }>({ total: 0, recent: 0, perDay: {} });
  useEffect(() => {
    async function load() {
      const allVocab = await db.vocabulary.filter((v) => !!v.learned_at).toArray();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 14);
      const cutoffStr = cutoff.toISOString();
      const recentVocab = allVocab.filter((v) => v.learned_at! >= cutoffStr);
      const perDay: Record<string, number> = {};
      for (const v of recentVocab) {
        const day = v.learned_at!.slice(0, 10);
        perDay[day] = (perDay[day] ?? 0) + 1;
      }
      setWordsData({ total: allVocab.length, recent: recentVocab.length, perDay });
    }
    load();
  }, []);

  // Build last 14 days chart data
  const chartData = useMemo(() => {
    const days: { day: string; lessons: number; reviews: number; words: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const activity = dailyActivity[key];
      days.push({
        day: d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' }),
        lessons: activity?.lessons ?? 0,
        reviews: activity?.reviews ?? 0,
        words: wordsData.perDay[key] ?? 0,
      });
    }
    return days;
  }, [dailyActivity, wordsData.perDay]);

  const hasActivity = chartData.some((d) => d.lessons > 0 || d.reviews > 0 || d.words > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Flame} label="Current streak" value={streak} sub={`Best: ${longestStreak}`} color="bg-orange-500" />
          <StatCard icon={Trophy} label="Level" value={levelInfo.level} sub={levelInfo.rank} color="bg-purple-500" />
          <StatCard icon={BookOpen} label="Lessons done" value={lessonsCompleted.length} color="bg-blue-500" />
          <StatCard icon={GraduationCap} label="Words learned" value={wordsData.total} sub={`${wordsData.recent} in last 14 days`} color="bg-amber-500" />
          <StatCard icon={RotateCcw} label="Total XP" value={xp} color="bg-green-500" />
        </div>

        {/* Activity chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Last 14 days</CardTitle>
          </CardHeader>
          <CardContent>
            {hasActivity ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={24} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    cursor={{ fill: '#f3f4f6' }}
                  />
                  <Bar dataKey="lessons" name="Lessons" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviews" name="Reviews" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="words" name="Words learned" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
                Complete lessons and reviews to see your activity here
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unit mastery */}
        {Object.keys(unitMastery).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Unit mastery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(unitMastery).map(([unitId, pct]) => (
                <div key={unitId} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16 truncate">{unitId.replace('unit-', 'Unit ')}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-orange-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-10 text-right">{pct}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
