import type { LessonMeta, Unit } from '@/types';
import type { StatusKind } from '@/shared/components/design';
import { curriculum } from '@/data/curriculum';

/** Chapters are the curriculum's units that have content. */
export function getChapters(): Unit[] {
  return curriculum.sections.flatMap((s) => s.units).filter((u) => u.lessons.length > 0);
}

export function getChapter(unitId: string): Unit | undefined {
  return getChapters().find((u) => u.id === unitId);
}

/** Writing lessons (chapter capstones). Until lessons carry a `role`, identified by name. */
export function isWritingLesson(lesson: LessonMeta): boolean {
  return lesson.name.startsWith('Practice Writing');
}

export function chapterProgress(unit: Unit, completed: string[]): number {
  const done = unit.lessons.filter((l) => completed.includes(l.id)).length;
  return Math.round((done / unit.lessons.length) * 100);
}

export function chapterStatus(unit: Unit, completed: string[]): Exclude<StatusKind, 'recommended'> {
  const pct = chapterProgress(unit, completed);
  if (pct === 100) return 'learned';
  return pct > 0 ? 'in-progress' : 'not-started';
}

/** The first chapter, in order, that isn't learned yet. */
export function recommendedChapter(completed: string[]): Unit | undefined {
  return getChapters().find((u) => chapterStatus(u, completed) !== 'learned');
}

export function nextLesson(unit: Unit, completed: string[]): LessonMeta | undefined {
  return unit.lessons.find((l) => !completed.includes(l.id));
}

/** A chapter's stamp is earned by its writing task, or by finishing it if it has none. */
export function stampEarned(unit: Unit, completed: string[]): boolean {
  const writing = unit.lessons.filter(isWritingLesson);
  if (writing.length > 0) return writing.every((l) => completed.includes(l.id));
  return chapterStatus(unit, completed) === 'learned';
}
