import type { VocabEntry } from '../types';
import { loadAllLessons } from '../data/lessonLoader';

/** In-memory vocabulary lookup — replaces Dexie vocabulary table. */
let _entries: VocabEntry[] = [];
let _byId: Map<string, VocabEntry> = new Map();
let _seeded = false;

/** Seed vocabulary from static lesson JSON. Call once on app init. */
export async function seedVocabulary(): Promise<void> {
  if (_seeded) return;

  const lessons = await loadAllLessons();
  const seen = new Set<string>();

  for (const lesson of lessons) {
    if (!lesson.vocabulary) continue;
    for (const v of lesson.vocabulary) {
      const id = v.id ?? v.word;
      if (seen.has(id)) continue;
      seen.add(id);
      _entries.push({
        id,
        word: v.word,
        meaning: v.meaning,
        example: v.example,
        unit_id: lesson.unit_id,
      });
    }
  }

  _byId = new Map(_entries.map((e) => [e.id, e]));
  _seeded = true;
}

/** Get a single vocab entry by ID. */
export function getVocab(id: string): VocabEntry | undefined {
  return _byId.get(id);
}

/** Get all vocab entries. */
export function getAllVocab(): VocabEntry[] {
  return _entries;
}

/** Get vocab entries for a specific unit. */
export function getVocabByUnit(unitId: string): VocabEntry[] {
  return _entries.filter((e) => e.unit_id === unitId);
}

/** Get vocab entries matching a filter. */
export function filterVocab(predicate: (e: VocabEntry) => boolean): VocabEntry[] {
  return _entries.filter(predicate);
}

/** Mark a word as learned (in-memory only — not persisted). */
export function markLearned(wordId: string): void {
  const entry = _byId.get(wordId);
  if (entry && !entry.learned_at) {
    entry.learned_at = new Date().toISOString();
  }
}
