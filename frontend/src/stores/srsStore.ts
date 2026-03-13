import { create } from 'zustand';
import type { Grade } from 'ts-fsrs';
import type { ExerciseType, SRSCard } from '../types';
import * as srs from '../engine/srs';
import { db } from './db';

interface SRSState {
  dueCards: SRSCard[];
  reviewableCount: number;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addCards: (
    cards: { wordId: string; skillType: ExerciseType }[],
  ) => Promise<void>;
  reviewCard: (cardId: number, grade: Grade) => Promise<void>;
  refreshDueCards: () => Promise<void>;
}

/** Count how many due cards have a matching vocabulary entry. */
async function countReviewable(dueCards: SRSCard[]): Promise<number> {
  let count = 0;
  for (const card of dueCards) {
    const entry = await db.vocabulary.get(card.word_id);
    if (entry) count++;
  }
  return count;
}

export const useSrsStore = create<SRSState>()((set, get) => ({
  dueCards: [],
  reviewableCount: 0,
  hydrated: false,

  async hydrate() {
    const dueCards = await srs.getDueCards();
    const reviewableCount = await countReviewable(dueCards);
    set({ dueCards, reviewableCount, hydrated: true });
  },

  async addCards(cards) {
    for (const { wordId, skillType } of cards) {
      const existing = await db.srsCards
        .where('[word_id+skill_type]')
        .equals([wordId, skillType])
        .first();
      if (!existing) {
        await srs.createCard(wordId, skillType);
      }
    }
    await get().refreshDueCards();
  },

  async reviewCard(cardId: number, grade: Grade) {
    const card = get().dueCards.find((c) => c.id === cardId);
    if (!card) return;

    await srs.reviewCard(card, grade);
    await get().refreshDueCards();
  },

  async refreshDueCards() {
    const dueCards = await srs.getDueCards();
    const reviewableCount = await countReviewable(dueCards);
    set({ dueCards, reviewableCount });
  },
}));
