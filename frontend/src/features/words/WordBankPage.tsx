import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
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

/** How each SRS status is shown, using the design system's status colours. */
const STATUS_INFO: Record<SRSStatus, { label: string; dot?: string }> = {
  new: { label: 'New' },
  learning: { label: 'Learning', dot: 'bg-in-progress' },
  due: { label: 'Due', dot: 'bg-fading' },
  mature: { label: 'Solid', dot: 'bg-learned' },
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'alpha', label: 'A–Z' },
  { key: 'strength', label: 'Strength' },
  { key: 'due', label: 'Due date' },
  { key: 'unit', label: 'Chapter' },
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

/** A dropdown for the toolbar (shadcn Select). `options` maps each value to its label. */
function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <Select items={options} value={value} onValueChange={(v) => v !== null && onChange(v)}>
      <SelectTrigger size="lg" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
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

  const control = 'h-11 rounded-lg border-2 border-border bg-white text-base outline-none transition-colors focus:border-cobalto';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-heading">Word bank</h2>
        <span className="text-sm text-muted-foreground">{sorted.length} of {words.length}</span>
      </div>

      {/* One toolbar: search, status, chapter, sort. Controls stay the same size however many chapters exist. */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search words…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(control, 'w-full pr-4 pl-10')}
          />
        </div>

        <div role="group" aria-label="Filter by status" className="flex h-11 rounded-lg border-2 border-border bg-white p-0.5">
          {([null, 'due', 'learning', 'mature'] as (SRSStatus | null)[]).map((st) => (
            <button
              key={st ?? 'all'}
              type="button"
              aria-pressed={filterStatus === st}
              onClick={() => setFilterStatus(st)}
              className={cn(
                'rounded-md px-3.5 text-sm font-medium transition-colors',
                filterStatus === st ? 'bg-foreground text-white' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {st ? STATUS_INFO[st].label : 'All'}
            </button>
          ))}
        </div>

        <Dropdown
          label="Chapter"
          value={filterUnit ?? 'all'}
          options={[
            { value: 'all', label: 'All chapters' },
            ...units.map((uid) => ({ value: uid, label: getUnitName(uid) })),
          ]}
          onChange={(v) => setFilterUnit(v === 'all' ? null : v)}
        />

        <div className="flex items-center gap-1">
          <Dropdown
            label="Sort by"
            value={sortKey}
            options={SORT_OPTIONS.map((opt) => ({ value: opt.key, label: opt.label }))}
            onChange={(v) => {
              setSortKey(v as SortKey);
              setReversed(false);
            }}
          />
          <button
            type="button"
            onClick={() => setReversed((r) => !r)}
            aria-label={reversed ? 'Sort descending' : 'Sort ascending'}
            className={cn(control, 'flex w-11 items-center justify-center text-muted-foreground hover:text-foreground')}
          >
            {reversed ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
          </button>
        </div>
      </div>

      {words.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">Complete lessons to collect vocabulary.</p>
      ) : sorted.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No words match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {sorted.map((w) => {
            const { status, stability, reps, due } = getCardStats(cardMap.get(w.id));
            const info = STATUS_INFO[status];
            const strength = getStrength(stability);
            const nextReview = formatNextReview(due, status);
            const strengthColor = strength >= 70 ? 'bg-learned' : strength >= 30 ? 'bg-in-progress' : 'bg-fading';

            return (
              <div key={w.id} className="flex flex-col gap-1 rounded-lg border border-border bg-white px-4.5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold">{w.word}</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    {info.dot && <span className={cn('size-2 rounded-full', info.dot)} />}
                    {info.label}
                  </span>
                </div>
                <p className="text-muted-foreground">{w.meaning}</p>
                {w.example && <p className="text-sm italic">{w.example}</p>}
                {status === 'new' ? (
                  <p className="mt-1 text-xs text-muted-foreground">{getUnitName(w.unit_id)}</p>
                ) : (
                  <div className="mt-2 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-vuoto">
                        <div className={cn('h-full rounded-full', strengthColor)} style={{ width: `${strength}%` }} />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">{strength}%</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {reps > 0 && <span>{reps} review{reps !== 1 ? 's' : ''}</span>}
                      {nextReview && <span>{nextReview}</span>}
                      <span>{getUnitName(w.unit_id)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
