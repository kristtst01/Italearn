import { fsrs, createEmptyCard, Rating, type Grade } from 'ts-fsrs';
import type { SRSCard } from '../types';

const f = fsrs({ request_retention: 0.9 });

/** Create card data pre-reviewed with an Easy rating for longer initial stability. */
export function createEmptyCardData(now: Date): Record<string, unknown> {
  const empty = createEmptyCard(now);
  const { card } = f.next(empty, now, Rating.Easy);
  return card as unknown as Record<string, unknown>;
}

/** Review a card locally and return the updated card (no persistence). */
export function reviewCardLocal(srsCard: SRSCard, grade: Grade): SRSCard {
  const now = new Date();
  const { card: nextCard, log } = f.next(srsCard.card, now, grade);

  return {
    ...srsCard,
    card: nextCard,
    due: nextCard.due,
    review_log: [...srsCard.review_log, log],
  };
}

/** Get count of due cards and total cards from a cards array. */
export function getCardCount(allCards: SRSCard[]): { due: number; total: number } {
  const now = new Date();
  const due = allCards.filter((c) => new Date(c.due) <= now).length;
  return { due, total: allCards.length };
}
