import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getVocab } from '@/engine/vocabCache';
import { useSrsStore } from '@/stores/srsStore';
import type { SRSCard, VocabEntry } from '@/types';
import { curriculum } from '@/data/curriculum';

type SRSStatus = 'new' | 'learning' | 'due' | 'mature';
type SortKey = 'recent' | 'alpha' | 'strength' | 'due' | 'unit';

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

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'alpha', label: 'A–Z' },
  { key: 'strength', label: 'Strength' },
  { key: 'due', label: 'Due date' },
  { key: 'unit', label: 'Unit' },
];

/** Map unit IDs to human-readable names from curriculum. */
function getUnitName(unitId: string): string {
  for (const section of curriculum.sections) {
    const unit = section.units.find((u) => u.id === unitId);
    if (unit) return unit.name;
  }
  return unitId;
}

/** Extract unit number for sorting (e.g. "unit-03" → 3). */
function unitOrder(unitId: string): number {
  const match = unitId.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export default function WordBankPage() {
  const allCards = useSrsStore((s) => s.allCards);
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<SRSStatus | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('recent');
  const [reversed, setReversed] = useState(false);

  // Derive learned words from SRS cards — a word is "learned" if it has at least one card
  const { words, cardMap } = useMemo(() => {
    const cMap = new Map<string, SRSCard>();
    const seen = new Set<string>();
    const vocabWords: VocabEntry[] = [];

    for (const card of allCards) {
      if (!cMap.has(card.word_id)) cMap.set(card.word_id, card);
      if (!seen.has(card.word_id)) {
        seen.add(card.word_id);
        const entry = getVocab(card.word_id);
        if (entry) vocabWords.push(entry);
      }
    }

    return { words: vocabWords, cardMap: cMap };
  }, [allCards]);

  const units = useMemo(() => {
    const set = new Set(words.map((w) => w.unit_id));
    return Array.from(set).sort();
  }, [words]);

  const filtered = useMemo(() => {
    let result = words;
    if (filterUnit) {
      result = result.filter((w) => w.unit_id === filterUnit);
    }
    if (filterStatus) {
      result = result.filter((w) => {
        const { status } = getCardStats(cardMap.get(w.id));
        return status === filterStatus;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q),
      );
    }
    return result;
  }, [words, filterUnit, filterStatus, search, cardMap]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const dir = reversed ? -1 : 1;
    switch (sortKey) {
      case 'alpha':
        list.sort((a, b) => dir * a.word.localeCompare(b.word, 'it'));
        break;
      case 'strength':
        list.sort((a, b) => {
          const sa = getCardStats(cardMap.get(a.id)).stability;
          const sb = getCardStats(cardMap.get(b.id)).stability;
          return dir * (sa - sb);
        });
        break;
      case 'due': {
        const now = Date.now();
        list.sort((a, b) => {
          const da = getCardStats(cardMap.get(a.id)).due;
          const db = getCardStats(cardMap.get(b.id)).due;
          return dir * ((da?.getTime() ?? now) - (db?.getTime() ?? now));
        });
        break;
      }
      case 'unit':
        list.sort((a, b) => dir * (unitOrder(a.unit_id) - unitOrder(b.unit_id)));
        break;
    }
    if (sortKey === 'recent' && reversed) list.reverse();
    return list;
  }, [filtered, sortKey, reversed, cardMap]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-6 pt-6 pb-3 space-y-3">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Word Bank</h1>
            <span className="text-sm text-gray-500">{sorted.length} of {words.length}</span>
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

          {/* Sort */}
          <div className="flex gap-1.5 overflow-x-auto">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  if (sortKey === opt.key) {
                    setReversed((r) => !r);
                  } else {
                    setSortKey(opt.key);
                    setReversed(false);
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  sortKey === opt.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
                {sortKey === opt.key && (reversed ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex gap-1.5 overflow-x-auto">
            {/* Status filters */}
            {(['due', 'learning', 'mature', 'new'] as SRSStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {STATUS_BADGE[s].label}
              </button>
            ))}
            <div className="w-px bg-gray-200 mx-1 shrink-0" />
            {/* Unit filters */}
            {units.map((uid) => (
              <button
                key={uid}
                onClick={() => setFilterUnit(filterUnit === uid ? null : uid)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  filterUnit === uid ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getUnitName(uid)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Word list */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        {words.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Complete lessons to unlock vocabulary
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No words match your filters
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sorted.map((w) => {
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

                        {status === 'new' && (
                          <p className="mt-2 text-[11px] text-gray-400">{getUnitName(w.unit_id)}</p>
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
                              <span>{getUnitName(w.unit_id)}</span>
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
