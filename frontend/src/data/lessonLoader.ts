import type { Lesson } from '../types';

/**
 * Lazy lesson loader using Vite's import.meta.glob.
 * Each lesson JSON is a separate chunk — loaded on demand, not bundled upfront.
 */
const lessonModules = import.meta.glob<Lesson>(
  './units/unit-*/unit-*-lesson-*.json',
  { import: 'default' },
);

/** Map lesson ID → dynamic import function */
const importMap = new Map<string, () => Promise<Lesson>>();
for (const [path, importFn] of Object.entries(lessonModules)) {
  const match = path.match(/\/(unit-\d+-lesson-\d+)\.json$/);
  if (match) importMap.set(match[1], importFn);
}

/** Load a single lesson by ID. Returns undefined if no matching file exists. */
export async function loadLesson(lessonId: string): Promise<Lesson | undefined> {
  const importFn = importMap.get(lessonId);
  if (!importFn) return undefined;
  return importFn();
}

/** Load all available lessons (used for vocabulary seeding at app init). */
export async function loadAllLessons(): Promise<Lesson[]> {
  const results = await Promise.all(
    [...importMap.values()].map((fn) => fn()),
  );
  return results;
}
