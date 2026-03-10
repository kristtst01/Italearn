import Dexie, { type EntityTable } from 'dexie';
import type { SRSCard, UserProgress } from '../types';

export const db = new Dexie('italearn') as Dexie & {
  srsCards: EntityTable<SRSCard, 'id'>;
  progress: EntityTable<UserProgress, 'id'>;
  lessonsCompleted: EntityTable<{ id?: number; lesson_id: string }, 'id'>;
};

db.version(1).stores({
  srsCards: '++id, [word_id+skill_type], due',
  progress: '++id',
  lessonsCompleted: '++id, &lesson_id',
});
