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
  };
}

async function persist(state: ProgressState) {
  await db.progress.put(toData(state));
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
    if (get().lessons_completed.includes(lessonId)) return;

    const updated = [...get().lessons_completed, lessonId];
    set({ lessons_completed: updated });
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
