import type { Exercise, SRSCard, VocabEntry } from '../types';
import { getVocab, getVocabByUnit, getAllVocab } from './vocabCache';
import { shuffle } from '../shared/utils/shuffle';

/**
 * Pick up to `count` random distractors from the vocabulary,
 * preferring words from the same unit, excluding the target word.
 */
function pickDistractors(
  entry: VocabEntry,
  count: number,
  mode: 'word' | 'meaning',
): string[] {
  let pool = getVocabByUnit(entry.unit_id).filter((v) => v.id !== entry.id);

  if (pool.length < count) {
    pool = getAllVocab().filter((v) => v.id !== entry.id);
  }

  const shuffled = shuffle(pool).slice(0, count);
  return shuffled.map((v) => (mode === 'word' ? v.word : v.meaning));
}

/**
 * Strip parenthetical notes from vocabulary meanings so they don't give away
 * the answer in review prompts.
 */
function cleanMeaning(meaning: string): string {
  return meaning.replace(/\s*\(.*?\)/g, '').trim();
}

/**
 * Build a cloze exercise: blank out the target word in the example sentence.
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
 */
function cardToExercise(card: SRSCard): Exercise | null {
  const entry = getVocab(card.word_id);
  if (!entry) return null;

  const baseId = `review-${card.id}`;
  const meaning = cleanMeaning(entry.meaning);

  if (card.skill_type === 'vocab') {
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
      distractors: pickDistractors(entry, 3, 'meaning').map(cleanMeaning),
      hints: [],
      target_words: [card.word_id],
    };
  }

  if (card.skill_type === 'writing') {
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
 * Get due SRS cards for a specific unit.
 */
export function getDueCardsForUnit(unitId: string, allCards: SRSCard[]): SRSCard[] {
  const vocabEntries = getVocabByUnit(unitId);
  const wordIds = new Set(vocabEntries.map((v) => v.id));
  const now = new Date();
  return allCards.filter((c) => wordIds.has(c.word_id) && new Date(c.due) <= now);
}

/**
 * Get SRS cards for learned vocabulary in a unit (regardless of due date).
 */
export function getLearnedCardsForUnit(unitId: string, allCards: SRSCard[]): SRSCard[] {
  const vocabEntries = getVocabByUnit(unitId).filter((v) => !!v.learned_at);
  const wordIds = new Set(vocabEntries.map((v) => v.id));
  return allCards.filter((c) => wordIds.has(c.word_id));
}

/**
 * Build a match_pairs exercise from a group of vocab cards.
 */
function buildMatchPairsExercise(
  cards: SRSCard[],
  index: number,
): { exercise: Exercise; cards: SRSCard[] } | null {
  const entries: VocabEntry[] = [];
  const usedCards: SRSCard[] = [];

  for (const card of cards) {
    const entry = getVocab(card.word_id);
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
 */
export function buildReviewExercises(dueCards: SRSCard[]): {
  exercises: Exercise[];
  cardMap: Map<string, SRSCard[]>;
} {
  const exercises: Exercise[] = [];
  const cardMap = new Map<string, SRSCard[]>();
  const usedCardIds = new Set<number>();

  const vocabCards = dueCards.filter((c) => c.skill_type === 'vocab');
  if (vocabCards.length >= 6) {
    const groupSize = Math.min(4, vocabCards.length - 2);
    const matchCards = shuffle(vocabCards).slice(0, groupSize);
    const result = buildMatchPairsExercise(matchCards, 0);
    if (result) {
      exercises.push(result.exercise);
      cardMap.set(result.exercise.id, result.cards);
      for (const c of result.cards) usedCardIds.add(c.id!);
    }
  }

  for (const card of dueCards) {
    if (usedCardIds.has(card.id!)) continue;
    const exercise = cardToExercise(card);
    if (exercise) {
      exercises.push(exercise);
      cardMap.set(exercise.id, [card]);
    }
  }

  return { exercises: shuffle(exercises), cardMap };
}

/**
 * Map a review answer to an FSRS grade (1-4).
 */
export function answerToGrade(correct: boolean, timeMs: number): 1 | 3 | 4 {
  if (!correct) return 1;
  if (timeMs < 5000) return 4;
  return 3;
}
