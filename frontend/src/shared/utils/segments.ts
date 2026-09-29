export type Segment = 'right' | 'wrong' | 'skipped' | 'current' | 'todo';

/** Progress segments from answered results plus the remaining count. */
export function toSegments(results: { correct: boolean; skipped?: boolean }[], total: number): Segment[] {
  return Array.from({ length: total }, (_, i) => {
    const r = results[i];
    if (r) return r.skipped ? 'skipped' : r.correct ? 'right' : 'wrong';
    return i === results.length ? 'current' : 'todo';
  });
}
