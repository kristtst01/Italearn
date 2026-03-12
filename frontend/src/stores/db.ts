import Dexie, { type EntityTable } from 'dexie';
import type { SRSCard, UserProgress, VocabEntry } from '../types';
import { curriculum } from '../data/curriculum';

export const db = new Dexie('italearn') as Dexie & {
  srsCards: EntityTable<SRSCard, 'id'>;
  progress: EntityTable<UserProgress, 'id'>;
  vocabulary: EntityTable<VocabEntry, 'id'>;
};

db.version(1).stores({
  srsCards: '++id, [word_id+skill_type], due',
  progress: '++id',
  lessonsCompleted: '++id, &lesson_id',
});

db.version(2).stores({
  srsCards: '++id, [word_id+skill_type], due',
  progress: '++id',
  lessonsCompleted: '++id, &lesson_id',
  vocabulary: '&id, unit_id',
});

db.version(3).stores({
  srsCards: '++id, [word_id+skill_type], due',
  progress: '++id',
  lessonsCompleted: null,
  vocabulary: '&id, unit_id',
});

/**
 * Seed the vocabulary table from static curriculum data.
 * Safe to call multiple times — skips words that already exist.
 */
export async function seedVocabulary(): Promise<void> {
  const entries: VocabEntry[] = [];
  const seen = new Set<string>();

  for (const section of curriculum.sections) {
    for (const unit of section.units) {
      for (const lesson of unit.lessons) {
        if (!lesson.vocabulary) continue;
        for (const v of lesson.vocabulary) {
          if (seen.has(v.word)) continue;
          seen.add(v.word);
          entries.push({
            id: v.word,
            word: v.word,
            meaning: v.meaning,
            example: v.example,
            unit_id: unit.id,
          });
        }
      }
    }
  }

  if (entries.length === 0) return;

  // bulkPut upserts — safe for re-seeding after curriculum updates
  await db.vocabulary.bulkPut(entries);
}
