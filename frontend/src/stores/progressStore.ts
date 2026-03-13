import { create } from 'zustand';
import type { UserProgress } from '../types';
import { db } from './db';
import { getLevel } from '../engine/xp';

const DEFAULT_PROGRESS: UserProgress = {
  id: 1,
  current_section: 'a1-basics',
  current_unit: '',
  current_lesson: '',
  xp: 0,
  streak: 0,
  level: 1,
  lessons_completed: [],
  checkpoints_passed: [],
  lesson_scores: {},
};

interface ProgressState extends UserProgress {
  hydrated: boolean;
  /** Level before the most recent addXP call — null if no level-up occurred */
  previousLevel: number | null;
  hydrate: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  clearLevelUp: () => void;
  completeLesson: (lessonId: string) => Promise<void>;
  saveLessonScore: (lessonId: string, score: number, total: number, missedExerciseIds: string[]) => Promise<void>;
  resetLesson: (lessonId: string) => Promise<void>;
  unlockUnit: (unitId: string) => Promise<void>;
  passCheckpoint: (sectionId: string) => Promise<void>;
}

function toData(state: ProgressState): UserProgress {
  return {
    id: 1,
    current_section: state.current_section,
    current_unit: state.current_unit,
    current_lesson: state.current_lesson,
    xp: state.xp,
    streak: state.streak,
    level: state.level,
    lessons_completed: state.lessons_completed,
    checkpoints_passed: state.checkpoints_passed,
    lesson_scores: state.lesson_scores,
  };
}

async function persist(state: ProgressState) {
  await db.progress.put(toData(state));
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  ...DEFAULT_PROGRESS,
  hydrated: false,
  previousLevel: null,

  async hydrate() {
    const saved = await db.progress.get(1);
    if (saved) {
      set({ ...saved, lesson_scores: saved.lesson_scores ?? {}, hydrated: true });
    } else {
      await db.progress.put({ ...DEFAULT_PROGRESS, id: 1 });
      set({ ...DEFAULT_PROGRESS, hydrated: true });
    }
  },

  async addXP(amount: number) {
    if (amount <= 0) return;

    const oldLevel = getLevel(get().xp).level;
    const newXP = get().xp + amount;
    const newLevelInfo = getLevel(newXP);

    const leveledUp = newLevelInfo.level > oldLevel;
    set({
      xp: newXP,
      level: newLevelInfo.level,
      previousLevel: leveledUp ? oldLevel : null,
    });
    await persist(get());

    // Update daily XP log
    const today = todayDateString();
    const existing = await db.xpLog.get(today);
    await db.xpLog.put({ date: today, xp: (existing?.xp ?? 0) + amount });
  },

  clearLevelUp() {
    set({ previousLevel: null });
  },

  async completeLesson(lessonId: string) {
    if (get().lessons_completed.includes(lessonId)) return;

    const updated = [...get().lessons_completed, lessonId];
    set({ lessons_completed: updated });
    await persist(get());
  },

  async saveLessonScore(lessonId: string, score: number, total: number, missedExerciseIds: string[]) {
    const current = get().lesson_scores[lessonId];
    // Only save if better than previous best (or first attempt)
    if (current && current.score >= score) return;

    const updated = { ...get().lesson_scores, [lessonId]: { score, total, missedExerciseIds } };
    set({ lesson_scores: updated });
    await persist(get());
  },

  async resetLesson(lessonId: string) {
    const scores = { ...get().lesson_scores };
    delete scores[lessonId];
    set({
      lessons_completed: get().lessons_completed.filter((id) => id !== lessonId),
      lesson_scores: scores,
    });
    await persist(get());
  },

  async unlockUnit(unitId: string) {
    set({ current_unit: unitId });
    await persist(get());
  },

  async passCheckpoint(sectionId: string) {
    if (get().checkpoints_passed.includes(sectionId)) return;

    const updated = [...get().checkpoints_passed, sectionId];
    set({ checkpoints_passed: updated });
    await persist(get());
  },
}));
