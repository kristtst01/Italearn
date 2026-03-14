import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { filterVocab } from '@/engine/vocabCache';
import { useSrsStore } from '@/stores/srsStore';
import type { SRSCard } from '@/types';
import { curriculum } from '@/data/curriculum';

type SRSStatus = 'new' | 'learning' | 'due' | 'mature';

function getCardStats(card: SRSCard | undefined) {
  if (!card) return { status: 'new' as SRSStatus, stability: 0, reps: 0, due: null as Date | null };
  const now = new Date();
  const fsrs = card.card as { stability?: number; reps?: number };
  const stability = fsrs.stability ?? 0;
  const reps = fsrs.reps ?? 0;
  const isDue = new Date(card.due) <= now;
  const status: SRSStatus = isDue ? 'due' : stability > 10 ? 'mature' : 'learning';
  return { status, stability, reps, due: new Date(card.due) };
}

/** Strength as 0–100 based on stability (30 days = full strength). */
function getStrength(stability: number): number {
  return Math.min(Math.round((stability / 30) * 100), 100);
}

function formatNextReview(due: Date | null, status: SRSStatus): string {
  if (!due || status === 'new') return '';
  const now = new Date();
  if (due <= now) return 'Due now';
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Due soon';
  if (diffHours < 24) return `Review in ${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'Review in 1 day';
  return `Review in ${diffDays} days`;
}

const STATUS_BADGE: Record<SRSStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  new: { label: 'New', variant: 'outline' },
  learning: { label: 'Learning', variant: 'secondary' },
  due: { label: 'Due', variant: 'destructive' },
  mature: { label: 'Mature', variant: 'default' },
};

/** Map unit IDs to human-readable names from curriculum. */
function getUnitName(unitId: string): string {
  for (const section of curriculum.sections) {
    const unit = section.units.find((u) => u.id === unitId);
    if (unit) return unit.name;
  }
  return unitId;
}

export default function WordBankPage() {
  const allCards = useSrsStore((s) => s.allCards);
  const words = useMemo(() => filterVocab((v) => !!v.learned_at), []);
  const cards = allCards;
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState<string | null>(null);

  const cardMap = useMemo(() => {
    const map = new Map<string, SRSCard>();
    for (const c of cards) {
      // Use the first card per word for status display
      if (!map.has(c.word_id)) map.set(c.word_id, c);
    }
    return map;
  }, [cards]);

  const units = useMemo(() => {
    const set = new Set(words.map((w) => w.unit_id));
    return Array.from(set).sort();
  }, [words]);

  const filtered = useMemo(() => {
    let result = words;
    if (filterUnit) {
      result = result.filter((w) => w.unit_id === filterUnit);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q),
      );
    }
    return result;
  }, [words, filterUnit, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Word Bank</h1>
          <span className="text-sm text-gray-500">{words.length} words</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Unit filter chips */}
        {units.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterUnit(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !filterUnit ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {units.map((uid) => (
              <button
                key={uid}
                onClick={() => setFilterUnit(filterUnit === uid ? null : uid)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterUnit === uid ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getUnitName(uid)}
              </button>
            ))}
          </div>
        )}

        {/* Word list */}
        {words.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Complete lessons to unlock vocabulary
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No words match your search
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((w) => {
              const { status, stability, reps, due } = getCardStats(cardMap.get(w.id));
              const badge = STATUS_BADGE[status];
              const strength = getStrength(stability);
              const nextReview = formatNextReview(due, status);
              const strengthColor =
                strength >= 70 ? 'bg-green-500' : strength >= 30 ? 'bg-amber-500' : 'bg-red-400';

              return (
                <Card key={w.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{w.word}</span>
                          <Badge variant={badge.variant} className="text-[10px]">{badge.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{w.meaning}</p>
                        {w.example && (
                          <p className="text-xs text-gray-400 mt-1 italic">"{w.example}"</p>
                        )}

                        {status !== 'new' && (
                          <div className="mt-2 space-y-1">
                            {/* Strength bar */}
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                                <div
                                  className={`h-full rounded-full transition-all ${strengthColor}`}
                                  style={{ width: `${strength}%` }}
                                />
                              </div>
                              <span className="text-[10px] tabular-nums text-gray-400">{strength}%</span>
                            </div>
                            {/* Review info */}
                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                              {reps > 0 && <span>{reps} review{reps !== 1 ? 's' : ''}</span>}
                              {nextReview && <span>{nextReview}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
