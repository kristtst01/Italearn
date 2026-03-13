import { fsrs } from 'ts-fsrs';
import type { SRSCard } from '../types';

const f = fsrs({ request_retention: 0.9 });

/**
 * Calculate mastery percentage for a unit based on its SRS cards' retrievability.
 * Returns 0-100. Returns 0 if no cards exist for the unit.
 *
 * Retrievability naturally decays as cards become overdue,
 * so mastery reflects real retention, not just completion.
 */
export function getUnitMastery(cards: SRSCard[], now: Date = new Date()): number {
  if (cards.length === 0) return 0;

  let totalR = 0;
  for (const srsCard of cards) {
    const r = f.get_retrievability(srsCard.card, now, false);
    totalR += r;
  }

  return Math.round((totalR / cards.length) * 100);
}
