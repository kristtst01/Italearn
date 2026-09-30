import type { TileStatus } from '@/shared/components/design';
import { GRAMMAR_PLAN, type PlannedGrammarUnit } from '@/data/grammarPlan';

/**
 * Status of a grammar unit (learned / in progress / not started).
 * Grammar units and their progress don't exist yet, so everything is "not started" for now;
 * this is the single place that changes when the `grammar_units` progress field arrives.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used once grammar progress exists
export function grammarUnitStatus(_unitId: string): TileStatus {
  return 'empty';
}

export function grammarTiles(): TileStatus[] {
  return GRAMMAR_PLAN.map((g) => grammarUnitStatus(g.id));
}

export type { PlannedGrammarUnit };
