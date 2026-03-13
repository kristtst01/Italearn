/** Streak calculation — operates on sorted arrays of ISO date strings (YYYY-MM-DD). */

function toDateObj(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(a: string, b: string): number {
  const ms = toDateObj(b).getTime() - toDateObj(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Consecutive days ending today (or yesterday).
 * If the user hasn't been active today but was yesterday, the streak is still alive
 * — it only breaks after a full missed day.
 */
export function getCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort();
  const today = todayDateString();
  const last = sorted[sorted.length - 1];

  const gap = daysBetween(last, today);
  // Streak is broken if last active day is more than 1 day ago
  if (gap > 1) return 0;

  let streak = 1;
  for (let i = sorted.length - 2; i >= 0; i--) {
    if (daysBetween(sorted[i], sorted[i + 1]) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** Longest consecutive run of days in the history. */
export function getLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (daysBetween(sorted[i - 1], sorted[i]) === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}

/** Whether today is already counted as an active day. */
export function isActiveToday(dates: string[]): boolean {
  return dates.includes(todayDateString());
}
