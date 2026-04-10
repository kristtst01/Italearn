import type { Exercise, VocabEntry } from '../types';
import { getVocabByUnit } from './vocabCache';
import { shuffle } from '../shared/utils/shuffle';
import { cleanMeaning, pickDistractors } from '../shared/utils/vocab';

const TARGET_EXERCISE_COUNT = 12;
const PASS_THRESHOLD = 0.9;

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

function buildMultipleChoice(id: string, entry: VocabEntry): Exercise {
  const meaning = cleanMeaning(entry.meaning);
  return {
    id,
    type: 'vocab',
    subtype: 'multiple_choice',
    prompt: { text: `What does '${entry.word}' mean?` },
    sentence_context: entry.example,
    correct_answer: meaning,
    distractors: pickDistractors(entry, 3, 'meaning'),
    hints: [],
    target_words: [entry.id],
  };
}

/**
 * Generate a challenging test-out exercise set for a unit.
 */
export function buildTestOutExercises(unitId: string): Exercise[] | null {
  const vocab = getVocabByUnit(unitId);
  if (vocab.length === 0) return null;

  const pool = shuffle(vocab);
  const exercises: Exercise[] = [];
  let idx = 0;

  for (const entry of pool) {
    if (exercises.length >= TARGET_EXERCISE_COUNT) break;

    const exId = `testout-${unitId}-${idx++}`;
    const roll = Math.random();

    if (roll < 0.4) {
      exercises.push(buildTypeAnswer(exId, entry));
    } else if (roll < 0.65) {
      const cloze = buildCloze(exId, entry);
      exercises.push(cloze ?? buildTypeAnswer(exId, entry));
    } else if (roll < 0.85) {
      const fb = buildFillBlank(exId, entry);
      exercises.push(fb ?? buildTypeAnswer(exId, entry));
    } else {
      exercises.push(buildMultipleChoice(exId, entry));
    }
  }

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
