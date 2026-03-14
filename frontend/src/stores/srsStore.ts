import { create } from 'zustand';
import type { Grade } from 'ts-fsrs';
import type { ExerciseType, SRSCard } from '../types';
import * as srs from '../engine/srs';
import { getUnitMastery } from '../engine/mastery';
import { getVocab } from '../engine/vocabCache';
import * as api from '../engine/api';

interface SRSState {
  dueCards: SRSCard[];
  allCards: SRSCard[];
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
function countReviewable(dueCards: SRSCard[]): number {
  let count = 0;
  for (const card of dueCards) {
    if (getVocab(card.word_id)) count++;
  }
  return count;
}

/** Compute mastery percentage per unit from all SRS cards. */
function computeUnitMastery(allCards: SRSCard[]): Record<string, number> {
  const wordToUnit = new Map<string, string>();
  for (const card of allCards) {
    const entry = getVocab(card.word_id);
    if (entry) wordToUnit.set(card.word_id, entry.unit_id);
  }

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
  allCards: [],
  reviewableCount: 0,
  unitMastery: {},
  hydrated: false,

  async hydrate() {
    try {
      const rawCards = await api.getSrsCards() as Record<string, unknown>[];
      const allCards = rawCards.map(mapApiCard);
      const now = new Date();
      const dueCards = allCards.filter((c) => new Date(c.due) <= now);
      const reviewableCount = countReviewable(dueCards);
      const unitMastery = computeUnitMastery(allCards);
      set({ allCards, dueCards, reviewableCount, unitMastery, hydrated: true });
    } catch (err) {
      console.error('Failed to hydrate SRS:', err);
      set({ hydrated: true });
    }
  },

  async addCards(cards) {
    const now = new Date();
    const toCreate = [];

    for (const { wordId, skillType } of cards) {
      // Check local state for dedup
      const exists = get().allCards.some(
        (c) => c.word_id === wordId && c.skill_type === skillType,
      );
      if (exists) continue;

      toCreate.push({
        word_id: wordId,
        skill_type: skillType,
        due: now.toISOString(),
        card_data: srs.createEmptyCardData(now),
        review_log: [],
      });
    }

    if (toCreate.length > 0) {
      try {
        const created = (await api.createSrsCards(toCreate)) as Record<string, unknown>[];
        const newCards = created.map(mapApiCard);
        const allCards = [...get().allCards, ...newCards];
        const dueCards = allCards.filter((c) => new Date(c.due) <= now);
        set({
          allCards,
          dueCards,
          reviewableCount: countReviewable(dueCards),
          unitMastery: computeUnitMastery(allCards),
        });
      } catch (err) {
        console.error('Failed to create SRS cards:', err);
      }
    }
  },

  async reviewCard(cardId: number, grade: Grade) {
    // Look in due cards first, fall back to all cards
    let card = get().dueCards.find((c) => c.id === cardId);
    if (!card) {
      card = get().allCards.find((c) => c.id === cardId);
    }
    if (!card) return;

    const updated = srs.reviewCardLocal(card, grade);

    // Update local state immediately
    const allCards = get().allCards.map((c) => (c.id === cardId ? updated : c));
    const now = new Date();
    const dueCards = allCards.filter((c) => new Date(c.due) <= now);
    set({
      allCards,
      dueCards,
      reviewableCount: countReviewable(dueCards),
      unitMastery: computeUnitMastery(allCards),
    });

    // Persist to API in background
    api.reviewSrsCard(String(card.api_id), {
      due: updated.due.toISOString(),
      card_data: updated.card,
      review_log: updated.review_log,
    }).catch((err) => console.error('Failed to persist card review:', err));
  },

  async refreshDueCards() {
    const allCards = get().allCards;
    const now = new Date();
    const dueCards = allCards.filter((c) => new Date(c.due) <= now);
    set({
      dueCards,
      reviewableCount: countReviewable(dueCards),
      unitMastery: computeUnitMastery(allCards),
    });
  },
}));

/** Map API response card to local SRSCard shape. */
function mapApiCard(raw: Record<string, unknown>): SRSCard {
  return {
    id: raw.id as number,       // used as local identifier
    api_id: raw.id as string,   // UUID from API
    word_id: raw.word_id as string,
    skill_type: raw.skill_type as ExerciseType,
    due: new Date(raw.due as string),
    card: raw.card_data as SRSCard['card'],
    review_log: (raw.review_log as SRSCard['review_log']) ?? [],
  };
}
