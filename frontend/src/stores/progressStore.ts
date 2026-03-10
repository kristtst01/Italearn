import { create } from 'zustand';
import type { UserProgress } from '../types';
import { db } from './db';

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
};

interface ProgressState extends UserProgress {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  unlockUnit: (unitId: string) => Promise<void>;
  passCheckpoint: (sectionId: string) => Promise<void>;
}

async function persist(state: UserProgress) {
  await db.progress.put({ ...state, id: 1 });
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  ...DEFAULT_PROGRESS,
  hydrated: false,

  async hydrate() {
    const saved = await db.progress.get(1);
    if (saved) {
      set({ ...saved, hydrated: true });
    } else {
      await db.progress.put({ ...DEFAULT_PROGRESS, id: 1 });
      set({ ...DEFAULT_PROGRESS, hydrated: true });
    }
  },

  async completeLesson(lessonId: string) {
    const { lessons_completed, ...rest } = get();
    if (lessons_completed.includes(lessonId)) return;

    const updated = [...lessons_completed, lessonId];
    set({ lessons_completed: updated });
    await persist({
      ...rest,
      lessons_completed: updated,
      checkpoints_passed: get().checkpoints_passed,
    });
  },

  async unlockUnit(unitId: string) {
    set({ current_unit: unitId });
    const state = get();
    await persist(state);
  },

  async passCheckpoint(sectionId: string) {
    const { checkpoints_passed, ...rest } = get();
    if (checkpoints_passed.includes(sectionId)) return;

    const updated = [...checkpoints_passed, sectionId];
    set({ checkpoints_passed: updated });
    await persist({
      ...rest,
      checkpoints_passed: updated,
      lessons_completed: get().lessons_completed,
    });
  },
}));
