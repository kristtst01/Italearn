import type { VocabEntry } from '../types';
import { loadAllLessons } from '../data/lessonLoader';

/** In-memory vocabulary lookup — replaces Dexie vocabulary table. */
let _entries: VocabEntry[] = [];
let _byId: Map<string, VocabEntry> = new Map();
/** The one seeding run; concurrent callers (e.g. React StrictMode effects) share it. */
let _seeding: Promise<void> | null = null;

/** Seed vocabulary from static lesson JSON. Safe to call more than once. */
export function seedVocabulary(): Promise<void> {
  _seeding ??= (async () => {
    const lessons = await loadAllLessons();
    const seen = new Set<string>();
    const entries: VocabEntry[] = [];

    for (const lesson of lessons) {
      if (!lesson.vocabulary) continue;
      for (const v of lesson.vocabulary) {
        const id = v.id ?? v.word;
        if (seen.has(id)) continue;
        seen.add(id);
        entries.push({
          id,
          word: v.word,
          meaning: v.meaning,
          example: v.example,
          unit_id: lesson.unit_id,
        });
      }
    }

    _entries = entries;
    _byId = new Map(entries.map((e) => [e.id, e]));
  })();
  return _seeding;
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
