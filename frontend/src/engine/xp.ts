// ── XP Calculation ──────────────────────────────────────────────

const LESSON_BASE_XP = 1;
const REVIEW_BASE_XP = 1;
function streakMultiplier(streakCount: number): number {
  if (streakCount >= 5) return 3;
  if (streakCount >= 3) return 2;
  return 1;
}

export function calculateExerciseXP(
  correct: boolean,
  streakCount: number,
): number {
  if (!correct) return 0;
  return LESSON_BASE_XP * streakMultiplier(streakCount);
}

export function calculateReviewXP(
  correct: boolean,
  streakCount: number,
): number {
  if (!correct) return 0;
  return REVIEW_BASE_XP * streakMultiplier(streakCount);
}

// ── Level System ────────────────────────────────────────────────

interface LevelThreshold {
  level: number;
  xp: number;
}

const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 500 },
  { level: 5, xp: 850 },
  { level: 6, xp: 1300 },
  { level: 7, xp: 1900 },
  { level: 8, xp: 2600 },
  { level: 9, xp: 3500 },
  { level: 10, xp: 4600 },
  { level: 11, xp: 5900 },
  { level: 12, xp: 7500 },
  { level: 13, xp: 9400 },
  { level: 14, xp: 11600 },
  { level: 15, xp: 14200 },
  { level: 16, xp: 17200 },
  { level: 17, xp: 20700 },
  { level: 18, xp: 24700 },
  { level: 19, xp: 29200 },
  { level: 20, xp: 34500 },
];

const RANKS: { minLevel: number; name: string }[] = [
  { minLevel: 1, name: 'Principiante' },
  { minLevel: 5, name: 'Studente' },
  { minLevel: 9, name: 'Intermedio' },
  { minLevel: 13, name: 'Avanzato' },
  { minLevel: 17, name: 'Esperto' },
];

export interface LevelInfo {
  level: number;
  rank: string;
  currentXP: number;
  currentThreshold: number;
  nextThreshold: number;
}

export function getLevel(totalXP: number): LevelInfo {
  let level = 1;
  let currentThreshold = 0;

  for (const t of LEVEL_THRESHOLDS) {
    if (totalXP >= t.xp) {
      level = t.level;
      currentThreshold = t.xp;
    } else {
      break;
    }
  }

  const nextEntry = LEVEL_THRESHOLDS.find((t) => t.level === level + 1);
  const nextThreshold = nextEntry?.xp ?? currentThreshold;

  let rank = RANKS[0].name;
  for (const r of RANKS) {
    if (level >= r.minLevel) rank = r.name;
  }

  return { level, rank, currentXP: totalXP, currentThreshold, nextThreshold };
}
