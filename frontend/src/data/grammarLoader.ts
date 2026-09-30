import type { GrammarPractice, GrammarUnitContent } from '@/types';

/**
 * Lazy loaders for written grammar units: the reading (<id>.md) and its practice
 * and mastery check (<id>.practice.json). Units without files are still planned.
 */
const readings = import.meta.glob<string>('./grammar/*.md', { query: '?raw', import: 'default' });
const practices = import.meta.glob<GrammarPractice>('./grammar/*.practice.json', { import: 'default' });

const idOf = (path: string) => path.replace(/^.*\//, '').replace(/(\.practice)?\.(md|json)$/, '');
const readingById = new Map(Object.entries(readings).map(([p, fn]) => [idOf(p), fn]));
const practiceById = new Map(Object.entries(practices).map(([p, fn]) => [idOf(p), fn]));

export function isGrammarUnitWritten(id: string): boolean {
  return readingById.has(id);
}

/** Splits off the front matter; only `sources` is read from it (the plan holds the rest). */
function parseReading(id: string, raw: string): GrammarUnitContent {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const front = m?.[1] ?? '';
  const sources = [...front.matchAll(/^\s+-\s+(.+)$/gm)].map((s) => s[1].replace(/^"(.*)"$/, '$1'));
  const body = (m ? raw.slice(m[0].length) : raw).replace(/^\s*# .*\n/, '');
  return { id, body, sources };
}

export async function loadGrammarReading(id: string): Promise<GrammarUnitContent | undefined> {
  const fn = readingById.get(id);
  return fn ? parseReading(id, await fn()) : undefined;
}

export async function loadGrammarPractice(id: string): Promise<GrammarPractice | undefined> {
  return practiceById.get(id)?.();
}
