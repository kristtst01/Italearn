import { create } from 'zustand';
import type { Badge, DailyActivity, GrammarUnitProgress, LessonScore, MasteryAttempt, UserProgress } from '../types';
import { getCurrentStreak, todayDateString } from '../engine/streak';
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
  lesson_scores: {},
  badges: [],
  streak_dates: [],
  daily_activity: {},
  grammar_units: {},
};

interface ProgressState extends UserProgress {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  saveLessonScore: (lessonId: string, score: number, total: number, missedExerciseIds: string[]) => Promise<void>;
  resetLesson: (lessonId: string) => Promise<void>;
  unlockUnit: (unitId: string) => Promise<void>;
  logActivity: (type: 'lesson' | 'review') => Promise<void>;
  markGrammarStep: (unitId: string, step: 'studiedAt' | 'practisedAt') => void;
  completeGrammarStop: (unitId: string, stopId: string, allStopIds: string[]) => void;
  recordMasteryCheck: (unitId: string, attempt: MasteryAttempt) => void;
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
    lesson_scores: state.lesson_scores,
    badges: state.badges,
    streak_dates: state.streak_dates,
    daily_activity: state.daily_activity,
    grammar_units: state.grammar_units,
  };
}

/** Fire-and-forget API persist — errors are logged but don't block UI. */
function persist(state: ProgressState) {
  api.updateProgress(toData(state)).catch((err) => {
    console.error('Failed to persist progress:', err);
  });
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  ...DEFAULT_PROGRESS,
  hydrated: false,

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
        lesson_scores: (saved.lesson_scores as Record<string, LessonScore>) ?? {},
        badges: (saved.badges as Badge[]) ?? [],
        streak_dates: (saved.streak_dates as string[]) ?? [],
        daily_activity: (saved.daily_activity as Record<string, DailyActivity>) ?? {},
        grammar_units: (saved.grammar_units as Record<string, GrammarUnitProgress>) ?? {},
        hydrated: true,
      });
    } catch (err) {
      console.error('Failed to hydrate progress:', err);
      set({ ...DEFAULT_PROGRESS, hydrated: true });
    }
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

  /** First time the reading was finished or the practice completed (kept once set). */
  markGrammarStep(unitId, step) {
    const current = get().grammar_units[unitId] ?? {};
    if (current[step]) return;
    set({ grammar_units: { ...get().grammar_units, [unitId]: { ...current, [step]: new Date().toISOString() } } });
    persist(get());
  },

  /** Records a finished practice stop; the unit is practised once every stop is done. */
  completeGrammarStop(unitId, stopId, allStopIds) {
    const current = get().grammar_units[unitId] ?? {};
    const stopsDone = current.stopsDone?.includes(stopId) ? current.stopsDone : [...(current.stopsDone ?? []), stopId];
    const allDone = allStopIds.every((id) => stopsDone.includes(id));
    const updated: GrammarUnitProgress = {
      ...current,
      studiedAt: current.studiedAt ?? new Date().toISOString(),
      stopsDone,
      practisedAt: current.practisedAt ?? (allDone ? new Date().toISOString() : undefined),
    };
    set({ grammar_units: { ...get().grammar_units, [unitId]: updated } });
    persist(get());
  },

  /** Keeps the latest attempt; a pass makes the unit learned (for good, even if a later retake fails). */
  recordMasteryCheck(unitId, attempt) {
    const current = get().grammar_units[unitId] ?? {};
    const updated: GrammarUnitProgress = {
      ...current,
      lastCheck: attempt,
      learnedAt: current.learnedAt ?? (attempt.passed ? attempt.at : undefined),
    };
    set({ grammar_units: { ...get().grammar_units, [unitId]: updated } });
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
