import type { VocabEntry } from '@/types';
import { getVocabByUnit, getAllVocab } from '@/engine/vocabCache';
import { shuffle } from './shuffle';

/**
 * Strip parenthetical notes from vocabulary meanings so they don't give away
 * the answer in review/test-out prompts.
 */
export function cleanMeaning(meaning: string): string {
  return meaning.replace(/\s*\(.*?\)/g, '').trim();
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
  const target = mode === 'word'
    ? entry.word.toLowerCase()
    : cleanMeaning(entry.meaning).toLowerCase();

  function isTooSimilar(v: VocabEntry): boolean {
    const value = (mode === 'word' ? v.word : cleanMeaning(v.meaning)).toLowerCase();
    return value.includes(target) || target.includes(value);
  }

  let pool = getVocabByUnit(entry.unit_id).filter((v) => v.id !== entry.id && !isTooSimilar(v));

  if (pool.length < count) {
    pool = getAllVocab().filter((v) => v.id !== entry.id && !isTooSimilar(v));
  }

  const shuffled = shuffle(pool).slice(0, count);
  return shuffled.map((v) => (mode === 'word' ? v.word : cleanMeaning(v.meaning)));
}
