import { curriculum } from '@/data/curriculum';

/**
 * Build a concise curriculum context string for LLM grading.
 * Tells the LLM what the student has learned so far.
 */
export function buildCurriculumContext(lessonsCompleted: string[]): string {
  const completed = new Set(lessonsCompleted);
  const lines: string[] = [];

  for (const section of curriculum.sections) {
    for (const unit of section.units) {
      if (unit.lessons.length === 0) continue;

      const completedLessons = unit.lessons.filter((l) => completed.has(l.id));
      if (completedLessons.length === 0) continue;

      const allDone = completedLessons.length === unit.lessons.length;
      const status = allDone ? 'completed' : `${completedLessons.length}/${unit.lessons.length} lessons`;
      lines.push(`- ${unit.name} (${status}): ${unit.grammar_focus}`);
    }
  }

  if (lines.length === 0) {
    return 'The student is a complete beginner with no completed lessons.';
  }

  return `The student has studied:\n${lines.join('\n')}`;
}
