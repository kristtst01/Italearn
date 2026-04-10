import type { VocabEntry } from '@/types';
import { getVocabByUnit, getAllVocab } from '@/engine/vocabCache';
import { shuffle } from './shuffle';

/**
 * Strip parenthetical notes from vocabulary meanings so they don't give away
 * the answer in review/test-out prompts.
 */
export function cleanMeaning(meaning: string): string {
  return meaning.replace(/\s*\(.*?\)\s*/g, '').trim();
}

/**
 * Pick up to `count` random distractors from the vocabulary,
 * preferring words from the same unit, excluding the target word.
 */
export function pickDistractors(
  entry: VocabEntry,
  count: number,
  mode: 'word' | 'meaning',
): string[] {
  let pool = getVocabByUnit(entry.unit_id).filter((v) => v.id !== entry.id);

  if (pool.length < count) {
    pool = getAllVocab().filter((v) => v.id !== entry.id);
  }

  const shuffled = shuffle(pool).slice(0, count);
  return shuffled.map((v) => (mode === 'word' ? v.word : cleanMeaning(v.meaning)));
}
