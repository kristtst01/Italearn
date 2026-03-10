import type { Exercise, SRSCard, VocabEntry } from '../types';
import { db } from '../stores/db';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick up to `count` random distractors from the vocabulary table,
 * preferring words from the same unit, excluding the target word.
 */
async function pickDistractors(
  entry: VocabEntry,
  count: number,
  mode: 'word' | 'meaning',
): Promise<string[]> {
  // Try same-unit words first
  let pool = await db.vocabulary
    .where('unit_id')
    .equals(entry.unit_id)
    .filter((v) => v.id !== entry.id)
    .toArray();

  // If not enough, pull from all vocabulary
  if (pool.length < count) {
    pool = await db.vocabulary
      .filter((v) => v.id !== entry.id)
      .toArray();
  }

  const shuffled = shuffle(pool).slice(0, count);
  return shuffled.map((v) => (mode === 'word' ? v.word : v.meaning));
}

/**
 * Convert an SRS card into a review Exercise.
 *
 * - vocab skill  → MultipleChoice (IT → EN): "What does 'ciao' mean?"
 * - writing skill → TypeAnswer    (EN → IT): "Translate to Italian: 'Hello'"
 */
async function cardToExercise(
  card: SRSCard,
): Promise<Exercise | null> {
  const entry = await db.vocabulary.get(card.word_id);
  if (!entry) return null;

  const baseId = `review-${card.id}`;

  if (card.skill_type === 'vocab') {
    return {
      id: baseId,
      type: 'vocab',
      subtype: 'multiple_choice',
      prompt: { text: `What does '${entry.word}' mean?` },
      sentence_context: entry.example,
      correct_answer: entry.meaning,
      distractors: await pickDistractors(entry, 3, 'meaning'),
      hints: [],
      target_words: [card.word_id],
    };
  }

  if (card.skill_type === 'writing') {
    return {
      id: baseId,
      type: 'vocab',
      subtype: 'type_answer',
      prompt: { text: `Translate to Italian: '${entry.meaning}'` },
      sentence_context: entry.example,
      correct_answer: entry.word,
      distractors: [],
      hints: [],
      target_words: [card.word_id],
    };
  }

  return null;
}

/**
 * Convert a list of due SRS cards into review exercises.
 * Skips cards whose word_id isn't found in the vocabulary table.
 */
export async function buildReviewExercises(dueCards: SRSCard[]): Promise<{
  exercises: Exercise[];
  cardMap: Map<string, SRSCard>;
}> {
  const exercises: Exercise[] = [];
  const cardMap = new Map<string, SRSCard>();

  for (const card of dueCards) {
    const exercise = await cardToExercise(card);
    if (exercise) {
      exercises.push(exercise);
      cardMap.set(exercise.id, card);
    }
  }

  return { exercises, cardMap };
}

/**
 * Map a review answer to an FSRS grade (1-4).
 *
 * - Incorrect → Again (1)
 * - Correct + fast (< 5s) → Easy (4)
 * - Correct → Good (3)
 */
export function answerToGrade(correct: boolean, timeMs: number): 1 | 3 | 4 {
  if (!correct) return 1;
  if (timeMs < 5000) return 4;
  return 3;
}
