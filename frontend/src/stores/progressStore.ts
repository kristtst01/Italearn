import { create } from 'zustand';
import type { Badge, UserProgress } from '../types';
import { db } from './db';
import { getLevel } from '../engine/xp';
import { getCurrentStreak } from '../engine/streak';
import { findLesson, collectTargetWords } from '../engine/lessonRunner';

const REVIEW_THRESHOLD = 5;

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
  badges: [],
  streak_dates: [],
  daily_activity: {},
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
  awardBadge: (sectionId: string) => Promise<void>;
  logActivity: (type: 'lesson' | 'review') => Promise<void>;
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
    badges: state.badges,
    streak_dates: state.streak_dates,
    daily_activity: state.daily_activity,
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
      set({
        ...saved,
        lesson_scores: saved.lesson_scores ?? {},
        badges: saved.badges ?? [],
        streak_dates: saved.streak_dates ?? [],
        daily_activity: saved.daily_activity ?? {},
        hydrated: true,
      });
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

    // Remove SRS cards for this lesson's target words
    const lesson = await findLesson(lessonId);
    if (lesson) {
      const words = collectTargetWords(lesson.exercises);
      if (words.length > 0) {
        // Delete all SRS cards matching these word_ids
        const allCards = await db.srsCards.toArray();
        const wordSet = new Set(words);
        const idsToDelete = allCards
          .filter((c) => wordSet.has(c.word_id))
          .map((c) => c.id!);
        if (idsToDelete.length > 0) {
          await db.srsCards.bulkDelete(idsToDelete);
        }
        // Refresh SRS store so UI updates mastery & due counts
        const { useSrsStore } = await import('./srsStore');
        await useSrsStore.getState().refreshDueCards();
      }
    }
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

  async awardBadge(sectionId: string) {
    if (get().badges.some((b) => b.sectionId === sectionId)) return;

    const badge: Badge = { sectionId, earnedAt: new Date().toISOString() };
    set({ badges: [...get().badges, badge] });
    await persist(get());
  },

  async logActivity(type: 'lesson' | 'review') {
    const today = todayDateString();
    const activity = { ...get().daily_activity };
    const todayActivity = activity[today] ?? { lessons: 0, reviews: 0 };

    if (type === 'lesson') {
      todayActivity.lessons += 1;
    } else {
      todayActivity.reviews += 1;
    }
    activity[today] = todayActivity;

    const meetsThreshold =
      todayActivity.lessons >= 1 || todayActivity.reviews >= REVIEW_THRESHOLD;

    let streakDates = get().streak_dates;
    if (meetsThreshold && !streakDates.includes(today)) {
      streakDates = [...streakDates, today];
    }

    set({
      daily_activity: activity,
      streak_dates: streakDates,
      streak: getCurrentStreak(streakDates),
    });
    await persist(get());
  },
}));
