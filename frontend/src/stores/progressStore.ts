import { create } from 'zustand';
import type { Badge, DailyActivity, LessonScore, UserProgress } from '../types';
import { getLevel } from '../engine/xp';
import { getCurrentStreak } from '../engine/streak';
import { findLesson, collectTargetWords } from '../engine/lessonRunner';
import * as api from '../engine/api';

const REVIEW_THRESHOLD = 1;

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

function toData(state: ProgressState): Omit<UserProgress, 'id'> {
  return {
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

/** Fire-and-forget API persist — errors are logged but don't block UI. */
function persist(state: ProgressState) {
  api.updateProgress(toData(state)).catch((err) => {
    console.error('Failed to persist progress:', err);
  });
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  ...DEFAULT_PROGRESS,
  hydrated: false,
  previousLevel: null,

  async hydrate() {
    try {
      const saved = await api.getProgress() as Record<string, unknown>;
      set({
        current_section: (saved.current_section as string) ?? DEFAULT_PROGRESS.current_section,
        current_unit: (saved.current_unit as string) ?? '',
        current_lesson: (saved.current_lesson as string) ?? '',
        xp: (saved.xp as number) ?? 0,
        streak: (saved.streak as number) ?? 0,
        level: (saved.level as number) ?? 1,
        lessons_completed: (saved.lessons_completed as string[]) ?? [],
        checkpoints_passed: (saved.checkpoints_passed as string[]) ?? [],
        lesson_scores: (saved.lesson_scores as Record<string, LessonScore>) ?? {},
        badges: (saved.badges as Badge[]) ?? [],
        streak_dates: (saved.streak_dates as string[]) ?? [],
        daily_activity: (saved.daily_activity as Record<string, DailyActivity>) ?? {},
        hydrated: true,
      });
    } catch (err) {
      console.error('Failed to hydrate progress:', err);
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
    persist(get());
  },

  clearLevelUp() {
    set({ previousLevel: null });
  },

  async completeLesson(lessonId: string) {
    if (get().lessons_completed.includes(lessonId)) return;

    const updated = [...get().lessons_completed, lessonId];
    set({ lessons_completed: updated });
    persist(get());
  },

  async saveLessonScore(lessonId: string, score: number, total: number, missedExerciseIds: string[]) {
    const current = get().lesson_scores[lessonId];
    if (current && (current as { score: number }).score >= score) return;

    const updated = { ...get().lesson_scores, [lessonId]: { score, total, missedExerciseIds } };
    set({ lesson_scores: updated });
    persist(get());
  },

  async resetLesson(lessonId: string) {
    const scores = { ...get().lesson_scores };
    delete scores[lessonId];
    set({
      lessons_completed: get().lessons_completed.filter((id) => id !== lessonId),
      lesson_scores: scores,
    });
    persist(get());

    // Refresh SRS store so UI updates mastery & due counts
    const lesson = await findLesson(lessonId);
    if (lesson) {
      const words = collectTargetWords(lesson.exercises);
      if (words.length > 0) {
        const { useSrsStore } = await import('./srsStore');
        await useSrsStore.getState().refreshDueCards();
      }
    }
  },

  async unlockUnit(unitId: string) {
    set({ current_unit: unitId });
    persist(get());
  },

  async passCheckpoint(sectionId: string) {
    if (get().checkpoints_passed.includes(sectionId)) return;

    const updated = [...get().checkpoints_passed, sectionId];
    set({ checkpoints_passed: updated });
    persist(get());
  },

  async awardBadge(sectionId: string) {
    if (get().badges.some((b) => b.sectionId === sectionId)) return;

    const badge: Badge = { sectionId, earnedAt: new Date().toISOString() };
    set({ badges: [...get().badges, badge] });
    persist(get());
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
    persist(get());
  },
}));
