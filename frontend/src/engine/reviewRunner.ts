import type { Exercise, SRSCard, VocabEntry } from '../types';
import { db } from '../stores/db';
import { shuffle } from '../shared/utils/shuffle';

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
 * Strip parenthetical notes from vocabulary meanings so they don't give away
 * the answer in review prompts. E.g. "hunger (ho fame = I'm hungry)" → "hunger".
 */
function cleanMeaning(meaning: string): string {
  return meaning.replace(/\s*\(.*?\)\s*/g, '').trim();
}

/**
 * Build a cloze exercise: blank out the target word in the example sentence.
 * Returns null if the word can't be found in the example.
 */
function buildClozeExercise(
  baseId: string,
  entry: VocabEntry,
  card: SRSCard,
): Exercise | null {
  const wordPattern = new RegExp(entry.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (!wordPattern.test(entry.example)) return null;
  const blanked = entry.example.replace(wordPattern, '___');
  return {
    id: baseId,
    type: 'vocab',
    subtype: 'cloze',
    prompt: { text: 'Complete the sentence with the missing word.' },
    sentence_context: blanked,
    correct_answer: entry.word,
    distractors: [],
    hints: [cleanMeaning(entry.meaning)],
    target_words: [card.word_id],
  };
}

/**
 * Convert an SRS card into a review Exercise.
 * Randomly varies between exercise types to keep reviews engaging:
 *
 * vocab skill:   multiple_choice (IT→EN) or cloze (blank word in example)
 * writing skill: type_answer (EN→IT) or fill_blank (blank word in example)
 */
async function cardToExercise(
  card: SRSCard,
): Promise<Exercise | null> {
  const entry = await db.vocabulary.get(card.word_id);
  if (!entry) return null;

  const baseId = `review-${card.id}`;
  const meaning = cleanMeaning(entry.meaning);

  if (card.skill_type === 'vocab') {
    // 40% chance of cloze if the word appears in the example
    if (Math.random() < 0.4) {
      const cloze = buildClozeExercise(baseId, entry, card);
      if (cloze) return cloze;
    }
    return {
      id: baseId,
      type: 'vocab',
      subtype: 'multiple_choice',
      prompt: { text: `What does '${entry.word}' mean?` },
      sentence_context: entry.example,
      correct_answer: meaning,
      distractors: (await pickDistractors(entry, 3, 'meaning')).map(cleanMeaning),
      hints: [],
      target_words: [card.word_id],
    };
  }

  if (card.skill_type === 'writing') {
    // 30% chance of fill_blank if the word appears in the example
    if (Math.random() < 0.3) {
      const cloze = buildClozeExercise(baseId, entry, card);
      if (cloze) {
        return { ...cloze, type: 'writing', subtype: 'fill_blank' };
      }
    }
    return {
      id: baseId,
      type: 'vocab',
      subtype: 'type_answer',
      prompt: { text: `Translate to Italian: '${meaning}'` },
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
 * Shuffles the result so cards don't appear in predictable order.
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

  return { exercises: shuffle(exercises), cardMap };
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
