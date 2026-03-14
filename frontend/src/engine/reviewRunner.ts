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
 * Get due SRS cards for a specific unit.
 * Only returns cards that are actually due for review (due date <= now).
 */
export async function getDueCardsForUnit(unitId: string): Promise<SRSCard[]> {
  const vocabEntries = await db.vocabulary.where('unit_id').equals(unitId).toArray();
  const wordIds = new Set(vocabEntries.map((v) => v.id));
  const allCards = await db.srsCards.toArray();
  const now = new Date();
  return allCards.filter((c) => wordIds.has(c.word_id) && new Date(c.due) <= now);
}

/**
 * Get SRS cards for learned vocabulary in a unit (regardless of due date).
 * Only includes words the user has actually encountered in completed lessons.
 */
export async function getLearnedCardsForUnit(unitId: string): Promise<SRSCard[]> {
  const vocabEntries = await db.vocabulary
    .where('unit_id')
    .equals(unitId)
    .filter((v) => !!v.learned_at)
    .toArray();
  const wordIds = new Set(vocabEntries.map((v) => v.id));
  const allCards = await db.srsCards.toArray();
  return allCards.filter((c) => wordIds.has(c.word_id));
}

/**
 * Build a match_pairs exercise from a group of vocab cards.
 * Returns null if fewer than 3 cards have valid vocabulary entries.
 */
async function buildMatchPairsExercise(
  cards: SRSCard[],
  index: number,
): Promise<{ exercise: Exercise; cards: SRSCard[] } | null> {
  const entries: VocabEntry[] = [];
  const usedCards: SRSCard[] = [];

  for (const card of cards) {
    const entry = await db.vocabulary.get(card.word_id);
    if (entry) {
      entries.push(entry);
      usedCards.push(card);
    }
  }

  if (entries.length < 3) return null;

  return {
    exercise: {
      id: `review-match-${index}`,
      type: 'vocab',
      subtype: 'match_pairs',
      prompt: { text: 'Match the Italian words with their English meanings' },
      sentence_context: '',
      correct_answer: entries.map((e) => `${e.word}|${cleanMeaning(e.meaning)}`),
      distractors: [],
      hints: [],
      target_words: usedCards.map((c) => c.word_id),
    },
    cards: usedCards,
  };
}

/**
 * Convert a list of due SRS cards into review exercises.
 * Skips cards whose word_id isn't found in the vocabulary table.
 * When enough vocab cards are due, groups some into match_pairs exercises.
 * Shuffles the result so cards don't appear in predictable order.
 */
export async function buildReviewExercises(dueCards: SRSCard[]): Promise<{
  exercises: Exercise[];
  cardMap: Map<string, SRSCard[]>;
}> {
  const exercises: Exercise[] = [];
  const cardMap = new Map<string, SRSCard[]>();
  const usedCardIds = new Set<number>();

  // Try to create a match_pairs exercise when we have enough vocab cards
  const vocabCards = dueCards.filter((c) => c.skill_type === 'vocab');
  if (vocabCards.length >= 6) {
    const groupSize = Math.min(4, vocabCards.length - 2); // leave at least 2 for individual
    const matchCards = shuffle(vocabCards).slice(0, groupSize);
    const result = await buildMatchPairsExercise(matchCards, 0);
    if (result) {
      exercises.push(result.exercise);
      cardMap.set(result.exercise.id, result.cards);
      for (const c of result.cards) usedCardIds.add(c.id!);
    }
  }

  // Process remaining cards individually
  for (const card of dueCards) {
    if (usedCardIds.has(card.id!)) continue;
    const exercise = await cardToExercise(card);
    if (exercise) {
      exercises.push(exercise);
      cardMap.set(exercise.id, [card]);
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
