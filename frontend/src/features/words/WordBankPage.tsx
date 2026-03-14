import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/stores/db';
import type { VocabEntry, SRSCard } from '@/types';
import { curriculum } from '@/data/curriculum';

type SRSStatus = 'new' | 'learning' | 'due' | 'mature';

function getStatus(card: SRSCard | undefined): SRSStatus {
  if (!card) return 'new';
  const now = new Date();
  if (card.due <= now) return 'due';
  // If stability > 10 days, consider mature
  const stability = (card.card as { s?: number }).s ?? 0;
  if (stability > 10) return 'mature';
  return 'learning';
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
  const [words, setWords] = useState<VocabEntry[]>([]);
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [allVocab, srsCards] = await Promise.all([
        db.vocabulary.toArray(),
        db.srsCards.toArray(),
      ]);
      setWords(allVocab.filter((v) => v.learned_at));
      setCards(srsCards);
    }
    load();
  }, []);

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
              const status = getStatus(cardMap.get(w.id));
              const badge = STATUS_BADGE[status];
              return (
                <Card key={w.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{w.word}</span>
                          <Badge variant={badge.variant} className="text-[10px]">{badge.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{w.meaning}</p>
                        {w.example && (
                          <p className="text-xs text-gray-400 mt-1 italic">"{w.example}"</p>
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
