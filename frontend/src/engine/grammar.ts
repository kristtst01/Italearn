import type { TileStatus } from '@/shared/components/design';
import { GRAMMAR_PLAN, type PlannedGrammarUnit } from '@/data/grammarPlan';
import { useProgressStore } from '@/stores/progressStore';

/** Learned once the mastery check is passed; in progress once the reading is finished. */
export function grammarUnitStatus(unitId: string): TileStatus {
  const p = useProgressStore.getState().grammar_units[unitId];
  if (p?.learnedAt) return 'learned';
  if (p?.studiedAt || p?.stopsDone?.length || p?.lastCheck) return 'in-progress';
  return 'empty';
}

export function grammarTiles(): TileStatus[] {
  return GRAMMAR_PLAN.map((g) => grammarUnitStatus(g.id));
}

/** Heading text → anchor id, shared by the reading and links into it. */
export function sectionAnchor(heading: string): string {
  return heading
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** The headings of a unit's reading, for its contents list. */
export function readingHeadings(body: string): { level: 2 | 3; text: string }[] {
  return [...body.matchAll(/^(#{2,3}) (.+)$/gm)].map((m) => ({
    level: m[1].length as 2 | 3,
    text: m[2].replace(/[*_`]/g, ''),
  }));
}

export type { PlannedGrammarUnit };
