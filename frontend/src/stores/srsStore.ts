import { create } from 'zustand';
import type { Grade } from 'ts-fsrs';
import type { ExerciseType, SRSCard } from '../types';
import * as srs from '../engine/srs';
import { getUnitMastery } from '../engine/mastery';
import { db } from './db';

interface SRSState {
  dueCards: SRSCard[];
  reviewableCount: number;
  /** Mastery percentage (0-100) per unit ID */
  unitMastery: Record<string, number>;
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

/** Compute mastery percentage per unit from all SRS cards. */
async function computeUnitMastery(): Promise<Record<string, number>> {
  const allCards = await db.srsCards.toArray();
  const vocabEntries = await db.vocabulary.toArray();
  const wordToUnit = new Map(vocabEntries.map((v) => [v.id, v.unit_id]));

  // Group cards by unit
  const cardsByUnit = new Map<string, SRSCard[]>();
  for (const card of allCards) {
    const unitId = wordToUnit.get(card.word_id);
    if (!unitId) continue;
    const group = cardsByUnit.get(unitId) ?? [];
    group.push(card);
    cardsByUnit.set(unitId, group);
  }

  const mastery: Record<string, number> = {};
  const now = new Date();
  for (const [unitId, cards] of cardsByUnit) {
    mastery[unitId] = getUnitMastery(cards, now);
  }
  return mastery;
}

export const useSrsStore = create<SRSState>()((set, get) => ({
  dueCards: [],
  reviewableCount: 0,
  unitMastery: {},
  hydrated: false,

  async hydrate() {
    const dueCards = await srs.getDueCards();
    const [reviewableCount, unitMastery] = await Promise.all([
      countReviewable(dueCards),
      computeUnitMastery(),
    ]);
    set({ dueCards, reviewableCount, unitMastery, hydrated: true });
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
    // Look in due cards first, fall back to DB (for unit practice reviews)
    let card = get().dueCards.find((c) => c.id === cardId);
    if (!card) {
      card = await db.srsCards.get(cardId) ?? undefined;
    }
    if (!card) return;

    await srs.reviewCard(card, grade);
    await get().refreshDueCards();
  },

  async refreshDueCards() {
    const dueCards = await srs.getDueCards();
    const [reviewableCount, unitMastery] = await Promise.all([
      countReviewable(dueCards),
      computeUnitMastery(),
    ]);
    set({ dueCards, reviewableCount, unitMastery });
  },
}));
