import type { Exercise, VocabEntry } from '../types';
import { db } from '../stores/db';
import { shuffle } from '../shared/utils/shuffle';

const TARGET_EXERCISE_COUNT = 12;
const PASS_THRESHOLD = 0.9;

/**
 * Strip parenthetical notes from vocabulary meanings.
 */
function cleanMeaning(meaning: string): string {
  return meaning.replace(/\s*\(.*?\)\s*/g, '').trim();
}

/**
 * Pick random distractors from vocabulary, preferring same-unit words.
 */
async function pickDistractors(
  entry: VocabEntry,
  count: number,
  mode: 'word' | 'meaning',
): Promise<string[]> {
  let pool = await db.vocabulary
    .where('unit_id')
    .equals(entry.unit_id)
    .filter((v) => v.id !== entry.id)
    .toArray();

  if (pool.length < count) {
    pool = await db.vocabulary
      .filter((v) => v.id !== entry.id)
      .toArray();
  }

  const shuffled = shuffle(pool).slice(0, count);
  return shuffled.map((v) => (mode === 'word' ? v.word : cleanMeaning(v.meaning)));
}

/**
 * Build a type_answer exercise (EN → IT production).
 */
function buildTypeAnswer(id: string, entry: VocabEntry): Exercise {
  return {
    id,
    type: 'vocab',
    subtype: 'type_answer',
    prompt: { text: `Translate to Italian: '${cleanMeaning(entry.meaning)}'` },
    sentence_context: entry.example,
    correct_answer: entry.word,
    distractors: [],
    hints: [],
    target_words: [entry.id],
  };
}

/**
 * Build a cloze exercise (blank the target word in example).
 * Returns null if the word doesn't appear in the example.
 */
function buildCloze(id: string, entry: VocabEntry): Exercise | null {
  const pattern = new RegExp(entry.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (!pattern.test(entry.example)) return null;
  const blanked = entry.example.replace(pattern, '___');
  return {
    id,
    type: 'writing',
    subtype: 'cloze',
    prompt: { text: 'Complete the sentence with the missing word.' },
    sentence_context: blanked,
    correct_answer: entry.word,
    distractors: [],
    hints: [cleanMeaning(entry.meaning)],
    target_words: [entry.id],
  };
}

/**
 * Build a fill_blank exercise.
 * Returns null if the word doesn't appear in the example.
 */
function buildFillBlank(id: string, entry: VocabEntry): Exercise | null {
  const pattern = new RegExp(entry.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (!pattern.test(entry.example)) return null;
  const blanked = entry.example.replace(pattern, '___');
  return {
    id,
    type: 'writing',
    subtype: 'fill_blank',
    prompt: { text: 'Fill in the missing word.' },
    sentence_context: blanked,
    correct_answer: entry.word,
    distractors: [],
    hints: [cleanMeaning(entry.meaning)],
    target_words: [entry.id],
  };
}

/**
 * Build a multiple_choice exercise (IT → EN recognition). Used sparingly.
 */
async function buildMultipleChoice(id: string, entry: VocabEntry): Promise<Exercise> {
  const meaning = cleanMeaning(entry.meaning);
  return {
    id,
    type: 'vocab',
    subtype: 'multiple_choice',
    prompt: { text: `What does '${entry.word}' mean?` },
    sentence_context: entry.example,
    correct_answer: meaning,
    distractors: await pickDistractors(entry, 3, 'meaning'),
    hints: [],
    target_words: [entry.id],
  };
}

/**
 * Generate a challenging test-out exercise set for a unit.
 * Heavily weighted toward production (type_answer, cloze, fill_blank).
 * Returns null if the unit has no vocabulary to test.
 */
export async function buildTestOutExercises(unitId: string): Promise<Exercise[] | null> {
  const vocab = await db.vocabulary.where('unit_id').equals(unitId).toArray();
  if (vocab.length === 0) return null;

  const pool = shuffle(vocab);
  const exercises: Exercise[] = [];
  let idx = 0;

  for (const entry of pool) {
    if (exercises.length >= TARGET_EXERCISE_COUNT) break;

    const exId = `testout-${unitId}-${idx++}`;
    const roll = Math.random();

    // 40% type_answer, 25% cloze, 20% fill_blank, 15% multiple_choice
    if (roll < 0.4) {
      exercises.push(buildTypeAnswer(exId, entry));
    } else if (roll < 0.65) {
      const cloze = buildCloze(exId, entry);
      if (cloze) {
        exercises.push(cloze);
      } else {
        exercises.push(buildTypeAnswer(exId, entry));
      }
    } else if (roll < 0.85) {
      const fb = buildFillBlank(exId, entry);
      if (fb) {
        exercises.push(fb);
      } else {
        exercises.push(buildTypeAnswer(exId, entry));
      }
    } else {
      exercises.push(await buildMultipleChoice(exId, entry));
    }
  }

  // If we have fewer exercises than target and more vocab, loop again
  if (exercises.length < TARGET_EXERCISE_COUNT && pool.length > 0) {
    const remaining = TARGET_EXERCISE_COUNT - exercises.length;
    const extra = shuffle(pool).slice(0, remaining);
    for (const entry of extra) {
      const exId = `testout-${unitId}-${idx++}`;
      exercises.push(buildTypeAnswer(exId, entry));
      if (exercises.length >= TARGET_EXERCISE_COUNT) break;
    }
  }

  return shuffle(exercises);
}

/** Check if a score passes the test-out threshold. */
export function isTestOutPass(score: number, total: number): boolean {
  if (total === 0) return false;
  return score / total >= PASS_THRESHOLD;
}

/** Get the pass threshold as a percentage. */
export const TEST_OUT_THRESHOLD = Math.round(PASS_THRESHOLD * 100);
