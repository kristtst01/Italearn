import { fsrs, createEmptyCard, type Grade } from 'ts-fsrs';
import type { SRSCard } from '../types';

const f = fsrs({ request_retention: 0.9 });

/** At most this many new cards come up for review per day; reviews of seen cards are never capped. */
export const NEW_CARDS_PER_DAY = 20;

/** A learner's day starts at 4 am, so a late-night lesson still counts as the same day (as in Anki). */
const DAY_START_HOUR = 4;

/** When the learner's current day began. */
export function startOfLearnerDay(now: Date): Date {
  const start = new Date(now);
  start.setHours(DAY_START_HOUR, 0, 0, 0);
  if (now < start) start.setDate(start.getDate() - 1);
  return start;
}

/**
 * A new card for a word just met in a lesson. The lesson was the first exposure, so the first
 * review is the next day, not straight away. Returns the card data and its due date.
 */
export function newCardFor(now: Date): { cardData: Record<string, unknown>; due: Date } {
  const due = startOfLearnerDay(now);
  due.setDate(due.getDate() + 1);
  return { cardData: createEmptyCard(due) as unknown as Record<string, unknown>, due };
}

/** A card that has never been reviewed. */
export function isNewCard(card: SRSCard): boolean {
  return card.review_log.length === 0;
}

/**
 * The cards to review now: every due card that has been reviewed before, plus new ones up to the
 * daily cap (minus the new cards already reviewed today), oldest first.
 */
export function selectDueCards(allCards: SRSCard[], now: Date = new Date()): SRSCard[] {
  const due = allCards.filter((c) => new Date(c.due) <= now);
  const seen = due.filter((c) => !isNewCard(c));
  const dayStart = startOfLearnerDay(now);
  const introducedToday = allCards.filter(
    (c) => !isNewCard(c) && new Date(c.review_log[0].review) >= dayStart,
  ).length;
  const room = Math.max(0, NEW_CARDS_PER_DAY - introducedToday);
  const fresh = due
    .filter(isNewCard)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime() || (a.id ?? 0) - (b.id ?? 0))
    .slice(0, room);
  return [...seen, ...fresh];
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
