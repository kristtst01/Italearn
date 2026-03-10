import { fsrs, createEmptyCard, type Grade, type Card } from 'ts-fsrs';
import type { ExerciseType } from '../types';
import type { SRSCard } from '../types';
import { db } from '../stores/db';

const f = fsrs({ request_retention: 0.9 });

/** Create a new SRS card for a word + skill pair and persist it. */
export async function createCard(
  wordId: string,
  skillType: ExerciseType,
): Promise<SRSCard> {
  const now = new Date();
  const card: Card = createEmptyCard(now);

  const srsCard: SRSCard = {
    word_id: wordId,
    skill_type: skillType,
    due: card.due,
    card,
    review_log: [],
  };

  const id = await db.srsCards.add(srsCard);
  return { ...srsCard, id: id as number };
}

/** Review a card with a given grade and persist the update. */
export async function reviewCard(
  srsCard: SRSCard,
  grade: Grade,
): Promise<SRSCard> {
  const now = new Date();
  const { card: nextCard, log } = f.next(srsCard.card, now, grade);

  const updated: SRSCard = {
    ...srsCard,
    card: nextCard,
    due: nextCard.due,
    review_log: [...srsCard.review_log, log],
  };

  await db.srsCards.update(srsCard.id!, {
    card: nextCard,
    due: nextCard.due,
    review_log: updated.review_log,
  });

  return updated;
}

/** Get all cards whose due date has passed. */
export async function getDueCards(): Promise<SRSCard[]> {
  const now = new Date();
  return db.srsCards.where('due').belowOrEqual(now).toArray();
}

/** Get count of due cards and total cards. */
export async function getCardCount(): Promise<{
  due: number;
  total: number;
}> {
  const now = new Date();
  const [due, total] = await Promise.all([
    db.srsCards.where('due').belowOrEqual(now).count(),
    db.srsCards.count(),
  ]);
  return { due, total };
}
